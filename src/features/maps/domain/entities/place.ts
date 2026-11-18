/**
 * Entidad de Dominio Place: Representación de una locación física obtenida de Google Maps Places API.
 *
 * - **¿Qué hace?**: Modela los datos geográficos y descriptivos de un lugar real: identificador único de Google (`placeId`),
 *   nombre comercial o institucional (`name`), dirección formateada (`address`), coordenadas geográficas (`latitude`, `longitude`)
 *   y enlace web directo a Google Maps (`googleMapsUri`).
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece al bounded context de Maps. Se origina al invocar `SearchPlacesUseCase`,
 *   se mapea desde `PlaceDto` mediante `toPlace`, y es consumida por el componente `PlaceSearch` dentro de los formularios
 *   de creación de lugares (`VenueForm`) para autocompletar nombre y dirección oficiales.
 * - **¿Cuál es su importancia?**: Proporciona una entidad estandarizada e inmutable (`readonly`) que encapsula la geolocalización
 *   urbana sin acoplar la interfaz de usuario al formato JSON extenso que devuelve Google Places API.
 */
export interface Place {
  readonly placeId: string;
  readonly name: string;
  readonly address: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  /** Enlace del lugar en Google Maps, si Google lo envía. */
  readonly googleMapsUri: string | null;
}
