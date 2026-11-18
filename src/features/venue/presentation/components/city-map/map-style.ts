import type { Map as MapLibreMap } from "maplibre-gl";

type PaintProperty = Parameters<MapLibreMap["setPaintProperty"]>[1];
type PaintValue = Parameters<MapLibreMap["setPaintProperty"]>[2];

/**
 * URL del estilo base vectorial servido por OpenFreeMap.
 *
 * - **¿Qué hace?**: Apunta al estilo base "positron" basado en datos abiertos de OpenStreetMap.
 * - **¿Cómo interactúa con el sistema en general?**: Cargado por MapLibre GL en `shared-map.ts`.
 * - **¿Cuál es su importancia?**: Permite renderizar cartografía completa sin costos de API key ni cuotas de proveedores comerciales.
 */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Coordenadas geográficas del centro histórico de Santiago de Cali (Plaza de Caycedo aprox.). */
export const CALI_CENTER: [number, number] = [-76.532, 3.4516];

/**
 * Paleta de colores para los temas visuales del mapa (claro y oscuro).
 *
 * - **¿Qué hace?**: Define valores hexadecimales específicos para terreno (`land`), agua (`water`),
 *   parques (`park`), vías (`road`), contornos de vías (`roadCasing`), edificios (`building`) y texto (`label`).
 * - **¿Cómo interactúa con el sistema en general?**: Armoniza el canvas WebGL de MapLibre con los temas `light` y `dark` de `globals.css`.
 * - **¿Cuál es su importancia?**: Dado que MapLibre no soporta directamente variables CSS ni `color-mix()`,
 *   esta paleta precalcula los colores exactos para una integración visual uniforme con el diseño de la aplicación.
 */
const PALETTE = {
  light: {
    land: "#f3f3f5", // gris 2 al 25 % sobre blanco
    water: "#e0e0fb", // azul al 18 % sobre blanco
    park: "#dbf1e4", // verde al 20 % sobre blanco
    road: "#ffffff",
    roadCasing: "#cecfd4", // gris 2
    building: "#e7e7ea", // gris 2 al 50 % sobre blanco
    label: "#000000",
    labelHalo: "#ffffff",
  },
  dark: {
    land: "#131313", // gris 2 al 9 % sobre negro
    water: "#121233", // azul al 22 % sobre negro
    park: "#0e2116", // verde al 18 % sobre negro
    road: "#303031", // gris 1 al 35 % sobre negro
    roadCasing: "#1b1b1c", // gris 1 al 20 % sobre negro
    building: "#252526", // gris 2 al 18 % sobre negro
    label: "#cecfd4", // gris 2
    labelHalo: "#000000",
  },
} as const;

export type MapTheme = keyof typeof PALETTE;

/**
 * Aplica una propiedad de pintura a una capa de MapLibre solo si dicha capa existe en el estilo actual.
 *
 * - **¿Qué hace?**: Verifica la existencia de `layer` mediante `map.getLayer(layer)` antes de invocar `setPaintProperty`.
 * - **¿Cómo interactúa con el sistema en general?**: Función auxiliar interna de `applyCityTheme`.
 * - **¿Cuál es su importancia?**: Evita excepciones en tiempo de ejecución si el estilo base no contiene alguna de las capas esperadas.
 */
function paintIf(map: MapLibreMap, layer: string, property: PaintProperty, value: PaintValue) {
  if (map.getLayer(layer)) map.setPaintProperty(layer, property, value);
}

/**
 * Aplica la paleta temática sobre el mapa y genera la extrusión 3D de edificaciones.
 *
 * - **¿Qué hace?**:
 *   1. Recorre y re-pinta capas de fondo, agua, parques, vías terrestres y etiquetas de texto según el tema (`light` o `dark`).
 *   2. Agrega dinámicamente la capa de extrusión volumétrica `building-3d` con tipo `fill-extrusion`,
 *      usando la altura real de OpenStreetMap (`render_height`) y una interpolación lineal según el nivel de zoom (13 a 15).
 * - **¿Cómo interactúa con el sistema en general?**: Llamada al inicializar el mapa en `shared-map.ts` y cada vez que
 *   cambia el atributo `data-theme` en el elemento `<html>` del documento.
 * - **¿Cuál es su importancia?**: Transforma un mapa plano 2D en una experiencia tridimensional inmersiva de la ciudad,
 *   sincronizada en tiempo real con el modo oscuro/claro del sistema.
 */
export function applyCityTheme(map: MapLibreMap, theme: MapTheme) {
  const c = PALETTE[theme];
  const style = map.getStyle();

  paintIf(map, "background", "background-color", c.land);
  paintIf(map, "water", "fill-color", c.water);
  paintIf(map, "waterway", "line-color", c.water);
  paintIf(map, "park", "fill-color", c.park);
  paintIf(map, "landcover_wood", "fill-color", c.park);
  paintIf(map, "landuse_residential", "fill-color", c.land);

  for (const layer of style.layers) {
    if (layer.type === "line" && /highway|road/.test(layer.id)) {
      paintIf(map, layer.id, "line-color", /casing/.test(layer.id) ? c.roadCasing : c.road);
    }
    if (layer.type === "symbol") {
      paintIf(map, layer.id, "text-color", c.label);
      paintIf(map, layer.id, "text-halo-color", c.labelHalo);
    }
  }

  paintIf(map, "building", "fill-color", c.building);

  // Edificios con la altura de OpenStreetMap. Se crea una vez; después el tema solo cambia colores
  if (!map.getLayer("building-3d")) {
    if (map.getLayer("building")) map.setLayoutProperty("building", "visibility", "none");
    map.addLayer(
      {
        id: "building-3d",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 13,
        paint: {
          "fill-extrusion-color": c.building,
          // Los edificios aparecen "creciendo" a medida que te acercas
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, ["coalesce", ["get", "render_height"], 6]],
          "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
          "fill-extrusion-opacity": 0.92,
        },
      },
      // Debajo de las etiquetas
      style.layers.find((l) => l.type === "symbol")?.id,
    );
  } else {
    map.setPaintProperty("building-3d", "fill-extrusion-color", c.building);
  }
}
