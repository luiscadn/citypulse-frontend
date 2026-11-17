/** Un evento tal como lo devuelve el backend (entidad Event de TypeORM). */
export interface EventDto {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  zone: { id: number; name: string };
  venue: { id: number; name: string } | null;
  addressText: string | null;
  origin: string;
  status: string;
  visibility: string;
  capacity: number | null;
  /** numeric de Postgres: llega como texto ("45000.00") */
  ticketPrice: string | number | null;
  createdBy: { id: number; username: string; fullName: string };
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceDto {
  id: number;
  type: string;
  url: string;
  caption: string | null;
}

/** Respuesta de GET /events/:id: el evento más evidencias y número de asistentes. */
export interface EventDetailDto extends EventDto {
  attendeeCount: number;
  evidences?: EvidenceDto[];
  rejectionReason: string | null;
}

/** Respuesta paginada de GET /events. */
export interface EventPageDto {
  data: EventDto[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/** Cuerpo de POST /events/report y PATCH /events/:id. */
export interface EventBodyDto {
  title: string;
  description?: string;
  zoneId: number;
  addressText?: string;
  startDate: string;
  endDate: string;
}

/** Elemento de GET /moderation/pending: el reporte con sus evidencias (sin lugar ni asistentes). */
export interface PendingReportDto extends EventDto {
  evidences: EvidenceDto[];
}

/** Cuerpo de POST /events/official. */
export interface OfficialEventBodyDto extends EventBodyDto {
  venueId: number;
  visibility: string;
  capacity?: number;
  ticketPrice?: number;
}

/** Cuerpo de POST /evidence/event/:eventId. */
export interface EvidenceBodyDto {
  type: string;
  url: string;
  caption?: string;
}
