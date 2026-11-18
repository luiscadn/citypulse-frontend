import type { Place } from "../../domain/entities/place";

/**
 * Interfaz PlaceSearchResult
 *
 * - **¿Qué hace?**: Modela la respuesta devuelta por la Server Action `searchPlacesAction`:
 *   contiene el arreglo de lugares encontrados (`places`) y un mensaje de error opcional (`error`).
 * - **¿Cómo interactúa con el sistema en general?**: Es el tipo retornado por `searchPlacesAction`
 *   y consumido por el estado local de `PlaceSearch`.
 * - **¿Cuál es su importancia?**: Permite que las Server Actions devuelvan resultados estructurados sin arrojar
 *   excepciones que rompan la transición de React, facilitando el control de UI ante errores esperados.
 */
export interface PlaceSearchResult {
  places: Place[];
  error?: string;
}
