"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";
import { Button } from "@/shared/presentation/components";
import { cn } from "@/shared/presentation/cn";
import type { MappedVenue } from "../../../domain/entities/venue";
import { CALI_CENTER } from "./map-style";
import {
  attachCityMap,
  type CityMapHandle,
  type CityMapView,
  detachCityMap,
  INTRO_CAMERA,
  INTRO_SPIN,
  prefersReducedMotion,
  setGestures,
} from "./shared-map";

/** Ángulo de la cámara. Los edificios son 3D en las dos: desde arriba se ven sus techos. */
type ViewMode = "tilted" | "top";

const VIEW_OPTIONS: readonly { mode: ViewMode; label: string }[] = [
  { mode: "tilted", label: "Inclinada" },
  { mode: "top", label: "Desde arriba" },
];

/** Velocidad de "Girar 360°" (grados por segundo): una vuelta en 40 s. */
const ORBIT_SPIN = 9;

const VIEW_CAMERA: Record<ViewMode, { pitch: number; bearing: number }> = {
  tilted: { pitch: 64, bearing: 18 },
  top: { pitch: 0, bearing: 0 },
};

/**
 * Normaliza un ángulo de rotación (bearing) en grados al rango cerrado de 0° a 359°.
 *
 * - **¿Qué hace?**: Aplica una operación de módulo positivo redondeado a entero.
 * - **¿Cómo interactúa con el sistema en general?**: Usada al sincronizar el slider de rotación y su etiqueta en el DOM.
 * - **¿Cuál es su importancia?**: Evita valores negativos o ángulos superiores a 360° en la interfaz de control.
 */
function normalizeBearing(bearing: number): number {
  return Math.round(((bearing % 360) + 360) % 360);
}

/**
 * Componente Interactivo del Mapa 3D de Santiago de Cali con Lugares Verificados.
 *
 * - **¿Qué hace?**:
 *   1. Inicializa el canvas WebGL de MapLibre conectándose con el ciclo de vida singleton en `shared-map.ts`.
 *   2. Despliega una portada panorámica cinemática donde la cámara orbita suavemente alrededor de la ciudad.
 *   3. Al presionar "Explorar el mapa", transiciona la cámara hacia el centroide de los lugares verificados (`flyTo`),
 *      habilita los gestos del ratón/pantalla táctil y despliega controles de rotación (360°), perspectiva ("Inclinada" vs "Desde arriba")
 *      y modo de pantalla completa nativo o por ventana con soporte de tecla Escape.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Consumido por `CityMapSection` en la página de inicio. Muestra pines interactivos (`Marker`) que enlazan a las páginas
 *   de detalle de los recintos culturales y deportivos de la ciudad (`/venues/[id]`).
 *
 * - **¿Cuál es su importancia?**:
 *   Es el componente visual insignia de CityPulse, ofreciendo una experiencia inmersiva basada en WebGL con extrusiones 3D
 *   de edificios, sincronización temática (dark/light) y optimización de rendimiento móvil mediante IntersectionObserver.
 */
export function CityMap({ venues }: { venues: readonly MappedVenue[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<CityMapHandle | null>(null);
  // true mientras se ve la portada (antes de "Explorar" o después de "Volver")
  const introRef = useRef(true);
  // El control de rotación se actualiza directo en el DOM: sin un render de React por cuadro
  const bearingInputRef = useRef<HTMLInputElement>(null);
  const bearingLabelRef = useRef<HTMLSpanElement>(null);
  const [orbiting, setOrbiting] = useState(false);
  // "fade": aparece con un fundido al tener el primer cuadro completo.
  // "instant": el mapa ya estaba cargado (se vuelve a la página) y aparece sin esperar
  const [ready, setReady] = useState<false | "fade" | "instant">(false);
  const [exploring, setExploring] = useState(false);
  const [failed, setFailed] = useState(false);
  // Pantalla completa. "native": API del navegador. "window": respaldo con CSS (p. ej. Safari en iPhone)
  const [expanded, setExpanded] = useState<false | "native" | "window">(false);
  const [mode, setMode] = useState<ViewMode>("tilted");

  // Abre la conexión a los mosaicos mientras carga la página: el mapa aparece antes
  preconnect("https://tiles.openfreemap.org", { crossOrigin: "anonymous" });

  useEffect(() => {
    const host = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!host || !wrapper) return;
    let started = false;

    const view: CityMapView = {
      onReady: (instant) => setReady(instant ? "instant" : "fade"),
      onFailed: () => setFailed(true),
      onOrbitStopped: () => setOrbiting(false),
      onBearing: (bearing) => {
        const value = normalizeBearing(bearing);
        if (bearingInputRef.current) bearingInputRef.current.value = String(value);
        if (bearingLabelRef.current) bearingLabelRef.current.textContent = `${value}°`;
      },
      isIntro: () => introRef.current,
    };

    // Un solo observador: monta el mapa cuando se acerca a la pantalla (MapLibre pesa y
    // se descarga recién entonces) y pausa el giro, y con él el dibujo, cuando sale de ella
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          attachCityMap(host, view, venues)
            .then((handle) => {
              if (handle) handleRef.current = handle;
            })
            .catch(() => setFailed(true));
        }
        handleRef.current?.orbit.setVisible(entry.isIntersecting);
      },
      { rootMargin: "300px 0px" },
    );
    visibility.observe(wrapper);

    // Al salir hacia otra página, el giro se pausa en el acto: la transición captura una
    // foto fija de esta página y no tiene sentido seguir dibujando el mapa mientras tanto
    const navigation = (window as Window & { navigation?: EventTarget }).navigation;
    const onNavigate = (event: Event) => {
      const destination = (event as Event & { destination?: { url: string } }).destination;
      if (destination && new URL(destination.url).pathname !== location.pathname) {
        handleRef.current?.orbit.setVisible(false);
      }
    };
    // Si la navegación se cancela y la página se queda, el giro sigue
    const onNavigateError = () => handleRef.current?.orbit.setVisible(true);
    navigation?.addEventListener("navigate", onNavigate);
    navigation?.addEventListener("navigateerror", onNavigateError);

    return () => {
      navigation?.removeEventListener("navigate", onNavigate);
      navigation?.removeEventListener("navigateerror", onNavigateError);
      visibility.disconnect();
      handleRef.current = null;
      detachCityMap(view);
    };
  }, [venues]);

  /**
   * Alterna la rotación automática panorámica de 360° de la cámara.
   *
   * - **¿Qué hace?**: Inicia o detiene la órbita de la cámara a velocidad constante (`ORBIT_SPIN`), actualizando el estado `orbiting`.
   * - **¿Cómo interactúa con el sistema en general?**: Ejecutada al hacer clic en el botón "Girar 360°" / "Detener giro".
   * - **¿Cuál es su importancia?**: Ofrece una perspectiva dinámica y envolvente del relieve urbano en la vista inclinada.
   */
  function toggleOrbit() {
    const orbit = handleRef.current?.orbit;
    if (!orbit) return;
    if (orbit.running) {
      orbit.stop();
      setOrbiting(false);
    } else {
      orbit.start(ORBIT_SPIN);
      setOrbiting(true);
    }
  }

  /**
   * Asigna manualmente la rotación de la cámara según el deslizador.
   *
   * - **¿Qué hace?**: Detiene la rotación automática e invoca `setBearing(value)` en MapLibre.
   * - **¿Cómo interactúa con el sistema en general?**: Conectada al evento `onInput` del control `<input type="range">`.
   * - **¿Cuál es su importancia?**: Permite al usuario orientar la vista hacia cualquier punto cardinal.
   */
  function setBearing(value: number) {
    handleRef.current?.orbit.stop();
    setOrbiting(false);
    handleRef.current?.map.setBearing(value);
  }

  /**
   * Cambia el ángulo de inclinación de la cámara (perspectiva 3D vs vista cenital).
   *
   * - **¿Qué hace?**: Actualiza el modo visual (`tilted` a 64° de pitch o `top` a 0° cenital) aplicando una transición suave `easeTo`.
   * - **¿Cómo interactúa con el sistema en general?**: Controlada por los botones de modo "Inclinada" y "Desde arriba".
   * - **¿Cuál es su importancia?**: Permite alternar entre una vista arquitectónica tridimensional y una vista de plano cartográfico tradicional.
   */
  function changeMode(next: ViewMode) {
    const map = handleRef.current?.map;
    setMode(next);
    if (!map) return;
    if (next === "top") {
      handleRef.current?.orbit.stop();
      setOrbiting(false);
    }
    const camera = VIEW_CAMERA[next];
    if (prefersReducedMotion()) map.jumpTo(camera);
    else map.easeTo({ ...camera, duration: 1200 });
  }

  // Sincroniza el estado cuando se sale con Esc o con el botón del navegador
  useEffect(() => {
    const onChange = () => {
      if (document.fullscreenElement === wrapperRef.current) setExpanded("native");
      else setExpanded((prev) => (prev === "native" ? false : prev));
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Esc sale de la vista completa. En la nativa el navegador ya lo hace; se escucha
  // igual por si no (y en el respaldo con CSS es la única forma)
  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.fullscreenElement) void document.exitFullscreen();
      else setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    if (expanded === "window") document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  /**
   * Alterna el modo de pantalla completa nativo o por ventana.
   *
   * - **¿Qué hace?**: Intenta utilizar la API `requestFullscreen()` del navegador; si es rechazada o no está disponible,
   *   aplica un respaldo de pantalla completa con posición CSS fija (`fixed inset-0 z-50`).
   * - **¿Cómo interactúa con el sistema en general?**: Conectada al botón de pantalla completa en la esquina superior derecha.
   * - **¿Cuál es su importancia?**: Garantiza compatibilidad universal, incluyendo navegadores móviles restrictivos (como Safari en iOS).
   */
  async function toggleFullscreen() {
    if (expanded === "native") return void document.exitFullscreen();
    if (expanded === "window") return setExpanded(false);
    if (!exploring) void explore();
    const wrapper = wrapperRef.current;
    if (wrapper && document.fullscreenEnabled) {
      try {
        await wrapper.requestFullscreen();
        return;
      } catch {
        // Si el navegador lo niega, se usa el respaldo
      }
    }
    setExpanded("window");
  }

  /**
   * Transiciona la experiencia desde la portada cinematográfica hacia la exploración interactiva.
   *
   * - **¿Qué hace?**: Oculta el velo de portada, detiene la rotación pasiva, habilita gestos interactivos,
   *   muestra controles de brújula y zoom, y realiza un vuelo de cámara cinemático (`flyTo`) hacia el promedio de coordenadas de los lugares.
   * - **¿Cómo interactúa con el sistema en general?**: Disparada por el botón principal "Explorar el mapa".
   * - **¿Cuál es su importancia?**: Brinda una bienvenida visual atractiva antes de ceder la interactividad completa al usuario.
   */
  function explore() {
    const handle = handleRef.current;
    if (!handle) return;
    const { map } = handle;
    setExploring(true);
    introRef.current = false;
    handle.orbit.stop();
    map.stop();
    setGestures(map, true);
    handle.showControls();

    const target =
      venues.length > 0
        ? {
            center: [
              venues.reduce((sum, v) => sum + v.longitude, 0) / venues.length,
              venues.reduce((sum, v) => sum + v.latitude, 0) / venues.length,
            ] as [number, number],
            zoom: 15.6,
          }
        : { center: CALI_CENTER, zoom: 14.5 };
    const camera = { ...target, ...VIEW_CAMERA[mode] };
    if (prefersReducedMotion()) map.jumpTo(camera);
    else map.flyTo({ ...camera, duration: 3200, essential: true, curve: 1.6 });
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative isolate overflow-hidden bg-neutral-soft",
        expanded === false && "h-[min(70dvh,36rem)] rounded-lg border border-line",
        expanded === "native" && "h-full w-full",
        expanded === "window" && "fixed inset-0 z-50 h-dvh w-full",
      )}
    >
      <div
        ref={containerRef}
        // h-full y no absolute: el CSS de MapLibre le pone position: relative al contenedor
        className={cn(
          "h-full w-full",
          ready === "fade" && "transition-opacity duration-700 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
        aria-busy={!ready}
        aria-label="Mapa de Cali con los lugares verificados"
        role="region"
      />

      {/* Velo de portada: se desvanece al explorar */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center",
          "bg-radial from-canvas/90 via-canvas/60 to-transparent transition-all duration-700 ease-out",
          // invisible: además de transparente, que sus botones no reciban clics
          exploring && "invisible scale-105 opacity-0",
        )}
        aria-hidden={exploring}
      >
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accent-strong uppercase">
          <span className="pulse-dot" aria-hidden />
          Mapa de Cali
        </p>
        <h2 className="max-w-xl text-2xl font-bold tracking-tight text-balance text-ink sm:text-4xl">
          Explora la ciudad y sus lugares verificados
        </h2>
        <p className="max-w-md text-sm text-ink-muted sm:text-base">
          {venues.length > 0
            ? "Toca los puntos del mapa para ver cada lugar. Puedes verlo inclinado o desde arriba."
            : "Aquí aparecerán los lugares verificados. Puedes ver la ciudad inclinada o desde arriba."}
        </p>
        <div className="pointer-events-auto mt-2">
          <Button size="lg" onClick={explore} disabled={exploring || failed}>
            Explorar el mapa
          </Button>
        </div>
        {failed && (
          <p className="pointer-events-auto text-sm text-danger-strong" role="alert">
            No pudimos cargar el mapa. Revisa tu conexión y recarga la página.
          </p>
        )}
      </div>

      {/* Pantalla completa: siempre a mano, arriba a la derecha */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {expanded && (
          <span className="hidden rounded-md bg-surface/90 px-2 py-1 text-xs font-medium text-ink-muted sm:inline">
            <kbd className="font-mono font-semibold text-ink">Esc</kbd> para salir
          </span>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          aria-label={expanded ? "Salir de pantalla completa" : "Ver el mapa en pantalla completa"}
          icon={
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
              {expanded ? (
                <path d="M8 3v5H3M12 3v5h5M8 17v-5H3M12 17v-5h5" />
              ) : (
                <path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" />
              )}
            </svg>
          }
        >
          <span className="hidden sm:inline">{expanded ? "Salir" : "Pantalla completa"}</span>
        </Button>
      </div>

      {exploring && (
        <div className="absolute top-3 left-3 flex animate-pop flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const handle = handleRef.current;
              setExploring(false);
              if (expanded === "native") void document.exitFullscreen();
              if (expanded === "window") setExpanded(false);
              if (!handle) return;
              const { map, orbit } = handle;
              setGestures(map, false);
              setMode("tilted");
              setOrbiting(false);
              orbit.stop();
              // Al terminar el vuelo, la portada vuelve a girar despacio
              introRef.current = true;
              map.once("moveend", () => {
                if (introRef.current && !prefersReducedMotion()) orbit.start(INTRO_SPIN);
              });
              map.flyTo({ ...INTRO_CAMERA, duration: 2000 });
            }}
          >
            ← Volver
          </Button>
          <div role="group" aria-label="Vista del mapa" className="flex rounded-md border border-line-strong bg-surface p-0.5">
            {VIEW_OPTIONS.map(({ mode: option, label }) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => changeMode(option)}
                className={cn(
                  "h-7 rounded-sm px-3 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring",
                  mode === option ? "bg-primary text-on-primary" : "text-ink-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Giro 360°: solo en la vista inclinada, que es donde el giro cambia lo que se ve */}
      {exploring && mode === "tilted" && (
        <div className="absolute bottom-3 left-3 flex animate-pop items-center gap-3 rounded-md border border-line-strong bg-surface/95 px-2 py-1.5 shadow-sm">
          <Button
            variant={orbiting ? "primary" : "secondary"}
            size="sm"
            onClick={toggleOrbit}
            aria-pressed={orbiting}
            icon={
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cn("size-4", orbiting && "motion-safe:animate-spin")} aria-hidden>
                <path d="M16.5 10a6.5 6.5 0 1 1-2-4.7" />
                <path d="M15 2.5v3.2h-3.2" />
              </svg>
            }
          >
            {orbiting ? "Detener giro" : "Girar 360°"}
          </Button>
          <label className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <span className="sr-only sm:not-sr-only">Rotación</span>
            <input
              ref={bearingInputRef}
              type="range"
              min={0}
              max={359}
              step={1}
              defaultValue={normalizeBearing(handleRef.current?.map.getBearing() ?? VIEW_CAMERA.tilted.bearing)}
              onInput={(event) => setBearing(Number(event.currentTarget.value))}
              aria-label="Rotación del mapa en grados"
              className="w-28 accent-primary sm:w-40"
            />
            <span ref={bearingLabelRef} className="w-9 tabular-nums text-ink">
              {normalizeBearing(handleRef.current?.map.getBearing() ?? VIEW_CAMERA.tilted.bearing)}°
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
