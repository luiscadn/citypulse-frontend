import type { Place } from "../../domain/entities/place";

/** Puerto: lo que la aplicación necesita del backend para buscar lugares en Google Maps. */
export interface MapsRepository {
  searchPlaces(query: string, limit: number): Promise<Place[]>;
}
