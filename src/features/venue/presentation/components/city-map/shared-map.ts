import type * as MapLibre from "maplibre-gl";
import type { Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import type { MappedVenue } from "../../../domain/entities/venue";
import { CameraOrbit } from "./camera-orbit";
import { applyCityTheme, CALI_CENTER, MAP_STYLE_URL, type MapTheme } from "./map-style";

/*
 * Un solo mapa para toda la sesión. Crear y destruir un mapa WebGL es caro: al salir del
 * inicio, destruirlo bloqueaba la navegación casi un segundo, y al volver había que bajar
 * otra vez estilo, mosaicos y edificios. Ahora el mapa se separa del DOM al salir y se
 * vuelve a montar al regresar, con todo ya cargado.
 */

export const INTRO_CAMERA = { center: CALI_CENTER, zoom: 13.4, pitch: 58, bearing: -20 };

/** Velocidad del giro de la portada (grados por segundo). */
export const INTRO_SPIN = 2;

/** Lo que el componente montado quiere saber del mapa. */
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

export function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** En la portada el mapa no responde a gestos: la rueda del mouse debe mover la página. */
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
 * Tarjeta de un lugar en el mapa. Se arma con nodos del DOM y textContent, nunca con
 * innerHTML: el nombre y la dirección los escribe un usuario.
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

/** Pin que late (estilos .map-pin en globals.css). */
function pinElement(venue: MappedVenue): HTMLElement {
  const pin = document.createElement("button");
  pin.type = "button";
  pin.className = "map-pin";
  pin.setAttribute("aria-label", `${venue.name}, ${venue.zone.name}`);
  return pin;
}

function startIntro(state: SharedMap) {
  if (view?.isIntro() && !prefersReducedMotion() && !state.orbit.running) state.orbit.start(INTRO_SPIN);
}

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

/** Pone los pines; si los lugares no cambiaron desde la última vez, no hace nada. */
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
 * Monta el mapa dentro de `host` (lo crea la primera vez). Devuelve null si el
 * componente se desmontó mientras tanto.
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

/** Separa el mapa del DOM sin destruirlo: queda listo para la próxima vez. */
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
