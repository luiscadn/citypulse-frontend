/** Lugar real encontrado en Google Maps (Places API). Solo lo que usa la UI. */
export interface Place {
  readonly placeId: string;
  readonly name: string;
  readonly address: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  /** Enlace del lugar en Google Maps, si Google lo envía. */
  readonly googleMapsUri: string | null;
}
