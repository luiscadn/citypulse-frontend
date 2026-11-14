import { PlaceQueryTooShortError } from "../errors/maps-errors";
import { PLACE_QUERY_MIN_LENGTH } from "./place-query-limits";

/** Texto de búsqueda limpio. Lanza si es demasiado corto para que valga la pena buscar. */
export function normalizePlaceQuery(raw: string): string {
  const query = raw.trim();
  if (query.length < PLACE_QUERY_MIN_LENGTH) throw new PlaceQueryTooShortError();
  return query;
}
