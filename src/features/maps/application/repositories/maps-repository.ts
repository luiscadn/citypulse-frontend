import type { Place } from "../../domain/entities/place";

/**
 * Puerto MapsRepository (Arquitectura Hexagonal / Limpia)
 *
 * - **¿Qué hace?**: Declara el contrato para la búsqueda geográfica de locaciones físicas (`searchPlaces`)
 *   recibiendo la cadena de búsqueda y el número máximo de resultados.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Es consumido por
 *   `SearchPlacesUseCase` e implementado por `HttpMapsRepository`.
 * - **¿Cuál es su importancia?**: Aísla la capa de aplicación de la API de Google Maps o de cualquier proveedor
 *   alternativo de geolocalización (ej. OpenStreetMap / Mapbox).
 */
export interface MapsRepository {
  searchPlaces(query: string, limit: number): Promise<Place[]>;
}
