/** Ciudad de CityPulse: se agrega para que Google no busque el lugar en otra parte. */
const CITY = "Cali";

/**
 * Enlace público de búsqueda en Google Maps (no necesita API key).
 * Sirve para "Ver en Google Maps" aunque el lugar no se haya buscado con la API.
 */
export function googleMapsSearchUrl(place: { name: string; address: string | null }): string {
  const query = [place.name, place.address, CITY].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
}
