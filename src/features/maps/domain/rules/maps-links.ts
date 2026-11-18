/** Ciudad base para acotar búsquedas geográficas en CityPulse */
const CITY = "Cali";

/**
 * Función googleMapsSearchUrl
 *
 * - **¿Qué hace?**: Construye una URL universal de Google Maps (`https://www.google.com/maps/search/?api=1&query=...`)
 *   concatenando el nombre del lugar, su dirección y la ciudad ("Cali").
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en componentes de detalle (`venue-detail.tsx`, `event-detail.tsx`)
 *   para habilitar enlaces que abran la ubicación del lugar en la app nativa o web de Google Maps del usuario.
 * - **¿Cuál es su importancia?**: Permite ofrecer redirección a mapas sin consumir llamadas pagas a la API de Places
 *   y asegura que la búsqueda siempre esté contextualizada geográficamente en Cali, Colombia.
 */
export function googleMapsSearchUrl(place: { name: string; address: string | null }): string {
  const query = [place.name, place.address, CITY].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query })}`;
}
