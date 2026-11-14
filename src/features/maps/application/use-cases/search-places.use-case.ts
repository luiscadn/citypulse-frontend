import type { Place } from "../../domain/entities/place";
import { normalizePlaceQuery } from "../../domain/rules/place-query";
import type { MapsRepository } from "../repositories/maps-repository";

/** Pocos resultados: es una ayuda para llenar el formulario, no un listado. */
export const PLACE_SEARCH_LIMIT = 5;

/** Busca lugares reales en Google Maps por texto libre. */
export class SearchPlacesUseCase {
  constructor(private readonly mapsRepository: MapsRepository) {}

  async execute(rawQuery: string): Promise<Place[]> {
    return this.mapsRepository.searchPlaces(normalizePlaceQuery(rawQuery), PLACE_SEARCH_LIMIT);
  }
}
