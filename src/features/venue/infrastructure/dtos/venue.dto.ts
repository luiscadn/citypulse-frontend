/** Un lugar tal como lo devuelve el backend (VENUE_SELECT en VenueService). */
export interface VenueDto {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  /** Opcionales: un backend sin la migración de coordenadas no los envía */
  latitude?: number | null;
  longitude?: number | null;
  isVerified: boolean;
  zone: { id: number; name: string };
  owner: { id: number; username: string; fullName: string };
  createdAt: string;
  updatedAt: string;
}

/** Respuesta paginada de GET /venues. */
export interface VenuePageDto {
  data: VenueDto[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/** Cuerpo de POST /venues y PATCH /venues/:id. */
export interface VenueBodyDto {
  name: string;
  address: string;
  description?: string | null;
  zoneId: number;
  latitude?: number | null;
  longitude?: number | null;
}
