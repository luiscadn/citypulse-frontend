import type { Map as MapLibreMap } from "maplibre-gl";

type PaintProperty = Parameters<MapLibreMap["setPaintProperty"]>[1];
type PaintValue = Parameters<MapLibreMap["setPaintProperty"]>[2];

/** Estilo base: OpenFreeMap (datos de OpenStreetMap, se actualiza cada semana, sin clave). */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Centro de Cali (Plaza de Caycedo, aprox.). */
export const CALI_CENTER: [number, number] = [-76.532, 3.4516];

/*
 * Colores del mapa: solo la paleta del equipo o mezclas de dos de sus colores
 * (los mismos color-mix de globals.css, ya calculados porque MapLibre no los entiende).
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

function paintIf(map: MapLibreMap, layer: string, property: PaintProperty, value: PaintValue) {
  if (map.getLayer(layer)) map.setPaintProperty(layer, property, value);
}

/** Pinta el estilo base con la paleta y agrega los edificios en 3D. */
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

