import type { Place } from "../../domain/entities/place";
import { normalizePlaceQuery } from "../../domain/rules/place-query";
import type { MapsRepository } from "../repositories/maps-repository";

/** Límite de resultados sugeridos para la búsqueda de lugares */
export const PLACE_SEARCH_LIMIT = 5;

/**
 * Caso de Uso: SearchPlacesUseCase
 *
 * - **¿Qué hace?**: Normaliza el texto de búsqueda con `normalizePlaceQuery` y consulta el repositorio
 *   de mapas acotando los resultados a un máximo de 5 sugerencias (`PLACE_SEARCH_LIMIT`).
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde la Server Action `searchPlacesAction`
 *   y es instanciado en `maps.container.ts`.
 * - **¿Cuál es su importancia?**: Centraliza la lógica de autocompletado de ubicaciones, garantizando que
 *   la interfaz reciba un número conciso y manejable de sugerencias relevantes.
 */
export class SearchPlacesUseCase {
  constructor(private readonly mapsRepository: MapsRepository) {}

  /**
   * Ejecuta la búsqueda de lugares.
   *
   * @param rawQuery - Cadena de texto preliminar ingresada por el usuario.
   * @returns Lista de lugares encontrados con coordenadas y direcciones.
   */
  async execute(rawQuery: string): Promise<Place[]> {
    return this.mapsRepository.searchPlaces(normalizePlaceQuery(rawQuery), PLACE_SEARCH_LIMIT);
  }
}
