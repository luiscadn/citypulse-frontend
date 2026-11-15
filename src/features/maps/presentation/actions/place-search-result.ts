import type { Place } from "../../domain/entities/place";

/** Lo que devuelve searchPlacesAction: nunca lanza por un error esperado, lo explica. */
export interface PlaceSearchResult {
  places: Place[];
  error?: string;
}
