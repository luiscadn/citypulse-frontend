/**
 * DTO PlaceDto (Data Transfer Object)
 *
 * - **¿Qué hace?**: Modela la carga útil devuelta por el backend al invocar `GET /maps/search`.
 *   Incluye `placeId`, `name`, `address`, `latitude`, `longitude`, `rating`, `types` y `googleMapsUri`.
 * - **¿Cómo interactúa con el sistema en general?**: Recibido por `HttpMapsRepository` y transformado
 *   a la entidad de dominio `Place` mediante `toPlace`.
 * - **¿Cuál es su importancia?**: Define el contrato exacto de serialización que entrega el backend,
 *   permitiendo filtrar propiedades accesorias no empleadas en la vista.
 */
export interface PlaceDto {
  placeId: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  types: string[];
  googleMapsUri: string | null;
}
