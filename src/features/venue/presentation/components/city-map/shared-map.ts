import type * as MapLibre from "maplibre-gl";
import type { Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import type { MappedVenue } from "../../../domain/entities/venue";
import { CameraOrbit } from "./camera-orbit";
import { applyCityTheme, CALI_CENTER, MAP_STYLE_URL, type MapTheme } from "./map-style";

/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: MAPA 3D, WEBGL, SINGLETON MAPA, MAPLIBRE, ATTACHCITYMAP,
 * DETACHCITYMAP, CREATEMAP, SYNCMARKERS, VENUECARD, PINELEMENT, RENDIMIENTO GPU
 * =================================================================================================
 *
 * Gestión del Ciclo de Vida Singleton de la Instancia de MapLibre GL en la Sesión
 *
 * - **¿Dónde se crea y reutiliza la instancia WebGL del mapa?**:
 *   En `createMap()` y `attachCityMap()` de este archivo (`src/features/venue/presentation/components/city-map/shared-map.ts`).
 * - **¿Qué hace?**: Mantiene una única instancia WebGL de MapLibre activa en memoria durante toda la sesión.
 *   Cuando el usuario navega fuera del inicio, el elemento DOM del mapa simplemente se desanexa (`detachCityMap`)
 *   sin destruir el contexto WebGL; al volver al inicio, se reanexa inmediatamente (`attachCityMap`).
 * - **¿Cómo interactúa con el sistema en general?**: Es el motor subyacente consumido por el componente React `CityMap`.
 * - **¿Cuál es su importancia?**: Inicializar y destruir un contexto WebGL y parsear estilos vectoriales cuesta cerca
 *   de 1 segundo de CPU y GPU en navegadores móviles y de escritorio. Este patrón Singleton previene bloqueos de navegación,
 *   elimina descargas repetidas de mosaicos vectoriales y garantiza una carga instantánea al volver a la página de inicio.
 */

export const INTRO_CAMERA = { center: CALI_CENTER, zoom: 13.4, pitch: 58, bearing: -20 };

/** Velocidad del giro de la portada (grados por segundo). */
export const INTRO_SPIN = 2;

/**
 * Interfaz de comunicación entre el mapa compartido y el componente React CityMap.
 *
 * - **¿Qué hace?**: Define callbacks que notifican cuando el mapa está listo, si falló la carga,
 *   cuando el usuario interrumpe la órbita con un gesto, y cuando cambia el bearing (rotación).
 * - **¿Cómo interactúa con el sistema en general?**: Implementada en `CityMap` para sincronizar inputs y estados React.
 * - **¿Cuál es su importancia?**: Desacopla la lógica imperativa del mapa WebGL de los estados declarativos de React.
 */
export interface CityMapView {
  /** El mapa ya tiene su primer cuadro completo. `instant`: ya lo tenía (se vuelve a la página). */
  onReady(instant: boolean): void;
  onFailed(): void;
  /** Un gesto de la persona detuvo el giro. */
  onOrbitStopped(): void;
  onBearing(bearing: number): void;
  /** true mientras se ve la portada: solo entonces gira sola. */
  isIntro(): boolean;
}

export interface CityMapHandle {
  readonly map: MapLibreMap;
  readonly orbit: CameraOrbit;
  /** Botones de zoom y brújula, al explorar. */
  showControls(): void;
}

interface SharedMap extends CityMapHandle {
  readonly element: HTMLDivElement;
  ready: boolean;
  markers: Marker[];
  markersKey: string;
  navigation: NavigationControl | null;
  readonly maplibre: typeof MapLibre;
  readonly resizer: ResizeObserver;
}

let shared: Promise<SharedMap> | null = null;
let view: CityMapView | null = null;

function currentTheme(): MapTheme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Detecta si el usuario tiene activada la preferencia de accesibilidad de reducción de movimiento.
 *
 * - **¿Qué hace?**: Evalúa `prefers-reduced-motion: reduce` mediante la API `window.matchMedia`.
 * - **¿Cómo interactúa con el sistema en general?**: Consultada antes de disparar animaciones de cámara (`flyTo`, `easeTo`, órbita).
 * - **¿Cuál es su importancia?**: Cumple con las pautas de accesibilidad WCAG para usuarios propensos a mareo o cinetosis.
 */
export function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Habilita o deshabilita los gestos interactivos del usuario sobre el mapa.
 *
 * - **¿Qué hace?**: Activa o desactiva en lote los manejadores de gestos de MapLibre (scroll zoom, arrastre, rotación, gestos táctiles, doble clic y caja).
 * - **¿Cómo interactúa con el sistema en general?**: Se deshabilitan en la portada para permitir scroll natural en la página, y se habilitan al pulsar "Explorar el mapa".
 * - **¿Cuál es su importancia?**: Evita el molesto "scroll trap" (donde la rueda del ratón queda atrapada haciendo zoom en el mapa en lugar de hacer scroll en la página).
 */
export function setGestures(map: MapLibreMap, enabled: boolean) {
  for (const handler of [
    map.scrollZoom,
    map.dragPan,
    map.dragRotate,
    map.touchZoomRotate,
    map.doubleClickZoom,
    map.keyboard,
    map.boxZoom,
  ]) {
    if (enabled) handler.enable();
    else handler.disable();
  }
}

/**
 * Genera el nodo DOM del popup con la información del lugar verificado.
 *
 * - **¿Qué hace?**: Construye de forma programática con la API estándar del DOM (`document.createElement`) y `textContent`
 *   los elementos visuales: zona, nombre, dirección y enlace a la vista de detalle (`/venues/[id]`).
 * - **¿Cómo interactúa con el sistema en general?**: Se asigna como contenido de los popups creados en `syncMarkers`.
 * - **¿Cuál es su importancia?**: Al usar `textContent` en lugar de `innerHTML`, previene ataques de inyección de código (XSS)
 *   en nombres y direcciones ingresados por usuarios.
 */
function venueCard(venue: MappedVenue): HTMLElement {
  const card = document.createElement("div");
  card.className = "flex flex-col gap-1 p-1";
  const zone = document.createElement("p");
  zone.className = "text-[11px] font-semibold tracking-widest text-primary-strong uppercase";
  zone.textContent = venue.zone.name;
  const name = document.createElement("p");
  name.className = "text-base font-semibold leading-snug text-ink";
  name.textContent = venue.name;
  card.append(zone, name);
  if (venue.address) {
    const address = document.createElement("p");
    address.className = "text-sm text-ink-muted";
    address.textContent = venue.address;
    card.append(address);
  }
  const link = document.createElement("a");
  link.href = `/venues/${venue.id}`;
  link.className = "mt-2 w-fit text-sm font-semibold text-primary-strong underline-offset-4 hover:underline";
  link.textContent = "Ver lugar →";
  card.append(link);
  return card;
}

/**
 * Crea el botón DOM para el marcador interactivo en el mapa.
 *
 * - **¿Qué hace?**: Retorna un `<button type="button">` con la clase CSS `.map-pin` y atributo de accesibilidad `aria-label`.
 * - **¿Cómo interactúa con el sistema en general?**: Se pasa como elemento de anclaje para los marcadores de MapLibre GL.
 * - **¿Cuál es su importancia?**: Permite estilar el marcador con animaciones de pulso en Tailwind/CSS y garantiza accesibilidad con teclado.
 */
function pinElement(venue: MappedVenue): HTMLElement {
  const pin = document.createElement("button");
  pin.type = "button";
  pin.className = "map-pin";
  pin.setAttribute("aria-label", `${venue.name}, ${venue.zone.name}`);
  return pin;
}

/**
 * Inicia el giro suave de bienvenida en la portada si aplican las condiciones adecuadas.
 */
function startIntro(state: SharedMap) {
  if (view?.isIntro() && !prefersReducedMotion() && !state.orbit.running) state.orbit.start(INTRO_SPIN);
}

/**
 * Inicializa de forma asíncrona la instancia singleton del mapa de MapLibre.
 *
 * - **¿Qué hace?**:
 *   1. Importa dinámicamente MapLibre GL y configura la URL de su Web Worker.
 *   2. Crea el contenedor DOM y la instancia `new maplibre.Map` con pixel ratio optimizado y antialiasing inteligente.
 *   3. Configura observadores de redimensionamiento (`ResizeObserver`), observador de cambio de tema (`MutationObserver`),
 *      manejadores de errores y eventos de gestos para detener la rotación automática al tocar el mapa.
 * - **¿Cómo interactúa con el sistema en general?**: Llamada por `attachCityMap` la primera vez que se monta el componente.
 * - **¿Cuál es su importancia?**: Centraliza la configuración avanzada del motor WebGL, optimizando el rendimiento
 *   en pantallas de alta densidad (Retina) limitando el pixel ratio a máximo 2x.
 */
async function createMap(): Promise<SharedMap> {
  const maplibre = await import("maplibre-gl");
  // Turbopack no copia el worker de MapLibre por su cuenta: se le pasa como recurso
  maplibre.setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);

  const element = document.createElement("div");
  element.className = "h-full w-full";
  const dpr = window.devicePixelRatio || 1;
  const map = new maplibre.Map({
    container: element,
    style: MAP_STYLE_URL,
    ...INTRO_CAMERA,
    attributionControl: { compact: true },
    // MapLibre no vigila el tamaño por su cuenta: al separarlo del DOM veía 0×0 y
    // redimensionaba el lienzo WebGL en plena navegación. Lo vigila `resizer`, solo montado
    trackResize: false,
    // En pantallas de alta densidad el suavizado no se nota y cuesta mucho GPU;
    // más de 2x tampoco se distingue
    canvasContextAttributes: { antialias: dpr < 2 },
    pixelRatio: Math.min(dpr, 2),
  });
  setGestures(map, false);
  const orbit = new CameraOrbit(map);

  const state: SharedMap = {
    map,
    orbit,
    maplibre,
    element,
    ready: false,
    markers: [],
    markersKey: "",
    navigation: null,
    resizer: new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0 && element.isConnected) map.resize();
    }),
    showControls() {
      if (state.navigation) return;
      state.navigation = new maplibre.NavigationControl({ visualizePitch: true });
      map.addControl(state.navigation, "bottom-right");
    },
  };

  map.on("error", (event) => {
    // Un mosaico que falla no rompe el mapa; sin estilo, sí: se descarta y el próximo intento lo crea de nuevo
    if (map.isStyleLoaded() || map.loaded() || !event.error) return;
    view?.onFailed();
    shared = null;
    map.remove();
  });

  // Un gesto de la persona (no la órbita) detiene el giro
  const stopOnGesture = (event: { originalEvent?: unknown }) => {
    if (!event.originalEvent || !orbit.running) return;
    orbit.stop();
    view?.onOrbitStopped();
  };
  map.on("dragstart", stopOnGesture);
  map.on("rotatestart", stopOnGesture);
  map.on("pitchstart", stopOnGesture);
  map.on("zoomstart", stopOnGesture);
  map.on("rotate", () => view?.onBearing(map.getBearing()));

  map.on("load", () => {
    applyCityTheme(map, currentTheme());
    // El mapa vive toda la sesión: el observador también
    new MutationObserver(() => applyCityTheme(map, currentTheme())).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Primer cuadro completo (o 4 s, si la red va lenta): se muestra el mapa y la
    // portada empieza a girar despacio. Antes no, para que no gire con mosaicos a medias
    const show = () => {
      if (state.ready) return;
      state.ready = true;
      view?.onReady(false);
      startIntro(state);
    };
    map.once("idle", show);
    setTimeout(show, 4000);
  });

  return state;
}

/**
 * Sincroniza los marcadores de los lugares verificados en el mapa.
 *
 * - **¿Qué hace?**: Genera una firma hash en texto (`markersKey`) con los IDs y coordenadas de los lugares.
 *   Si la firma no cambió respecto a la última sincronización, no hace nada; si cambió, remueve los marcadores viejos
 *   y crea nuevas instancias de `Marker` con sus popups asociados.
 * - **¿Cómo interactúa con el sistema en general?**: Llamada en `attachCityMap` al montar la vista de lugares.
 * - **¿Cuál es su importancia?**: Implementa reconciliación eficiente evitando recrear nodos y marcadores WebGL innecesariamente.
 */
function syncMarkers(state: SharedMap, venues: readonly MappedVenue[]) {
  const key = venues
    .map((v) => [v.id, v.latitude, v.longitude, v.name, v.address, v.zone.name].join("~"))
    .join("|");
  if (key === state.markersKey) return;
  state.markersKey = key;
  state.markers.forEach((marker) => marker.remove());
  state.markers = venues.map((venue) =>
    new state.maplibre.Marker({ element: pinElement(venue) })
      .setLngLat([venue.longitude, venue.latitude])
      .setPopup(
        new state.maplibre.Popup({ offset: 18, closeButton: false, maxWidth: "260px" }).setDOMContent(venueCard(venue)),
      )
      .addTo(state.map),
  );
}

/**
 * Anexa el mapa compartido al nodo contenedor del componente React.
 *
 * - **¿Qué hace?**: Registra la vista actual (`next`), obtiene la instancia singleton del mapa, inserta el canvas en `host`,
 *   redimensiona el mapa, activa la observación de tamaño con `ResizeObserver`, desactiva gestos temporales para la portada,
 *   posiciona la cámara en `INTRO_CAMERA` y sincroniza los marcadores de los lugares.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada dentro del `useEffect` del componente `CityMap`.
 * - **¿Cuál es su importancia?**: Es el punto de conexión principal donde la instancia persistente del mapa se asocia al DOM de React.
 */
export async function attachCityMap(
  host: HTMLElement,
  next: CityMapView,
  venues: readonly MappedVenue[],
): Promise<CityMapHandle | null> {
  view = next;
  shared ??= createMap().catch((error: unknown) => {
    shared = null;
    throw error;
  });
  const state = await shared;
  if (view !== next) return null;

  host.append(state.element);
  state.map.resize();
  state.resizer.observe(host);
  state.orbit.setVisible(true); // acaba de montarse en la zona visible (lo decide el observador del componente)
  setGestures(state.map, false);
  state.map.jumpTo(INTRO_CAMERA);
  syncMarkers(state, venues);
  if (state.ready) {
    next.onReady(true);
    startIntro(state);
  }
  return state;
}

/**
 * Desanexa el mapa del DOM al navegar hacia otra vista sin destruir su contexto.
 *
 * - **¿Qué hace?**: Desconecta el `ResizeObserver`, detiene la órbita de cámara y cualquier movimiento del mapa,
 *   cierra popups abiertos, remueve controles de navegación y retira el elemento `<div>` del DOM.
 * - **¿Cómo interactúa con el sistema en general?**: Ejecutada en la función de limpieza (cleanup) del `useEffect` de `CityMap`.
 * - **¿Cuál es su importancia?**: Libera el árbol de renderizado del navegador sin perder los recursos WebGL,
 *   garantizando que la próxima visita al mapa sea instantánea.
 */
export function detachCityMap(prev: CityMapView) {
  if (view !== prev) return;
  view = null;
  void shared
    ?.then((state) => {
      if (view) return; // otro montaje ya lo tomó
      state.resizer.disconnect();
      state.orbit.stop();
      state.map.stop();
      state.markers.forEach((marker) => marker.getPopup()?.remove());
      if (state.navigation) {
        state.map.removeControl(state.navigation);
        state.navigation = null;
      }
      state.element.remove();
    })
    .catch(() => {});
}
