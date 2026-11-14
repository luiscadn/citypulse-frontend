/** PlaceResult de GET /maps/search (maps.service.ts del backend). */
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
