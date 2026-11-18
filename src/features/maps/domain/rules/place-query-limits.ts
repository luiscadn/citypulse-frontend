/**
 * Constante PLACE_QUERY_MIN_LENGTH
 *
 * - **¿Qué hace?**: Define el umbral mínimo de caracteres (`3`) requerido para disparar una búsqueda de lugares en Google Maps.
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada por `normalizePlaceQuery` y `PlaceQueryTooShortError`.
 * - **¿Cuál es su importancia?**: Optimiza el consumo de cuota y costos de facturación de Google Cloud Places API,
 *   restringiendo las consultas a términos con significancia semántica.
 */
export const PLACE_QUERY_MIN_LENGTH = 3;
