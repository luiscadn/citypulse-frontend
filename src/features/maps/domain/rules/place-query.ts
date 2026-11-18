import { PlaceQueryTooShortError } from "../errors/maps-errors";
import { PLACE_QUERY_MIN_LENGTH } from "./place-query-limits";

/**
 * Función normalizePlaceQuery: Normalización y validación de términos de búsqueda geográfica.
 *
 * - **¿Qué hace?**: Elimina espacios en blanco iniciales y finales (`trim`) y valida que la longitud resultante
 *   sea de al menos `PLACE_QUERY_MIN_LENGTH` caracteres. Si es menor, lanza `PlaceQueryTooShortError`.
 * - **¿Cómo interactúa con el sistema en general?**: Es invocada al inicio de `SearchPlacesUseCase.execute`.
 * - **¿Cuál es su importancia?**: Asegura que ninguna búsqueda vacía o de pocas letras llegue a la capa de infraestructura,
 *   garantizando el principio "fail-fast".
 */
export function normalizePlaceQuery(raw: string): string {
  const query = raw.trim();
  if (query.length < PLACE_QUERY_MIN_LENGTH) throw new PlaceQueryTooShortError();
  return query;
}
