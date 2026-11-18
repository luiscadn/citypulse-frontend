/**
 * @file event.dto.ts
 * @description Data Transfer Objects (DTOs) para la comunicación HTTP con los endpoints de Eventos.
 * Modela con precisión los esquemas JSON de respuesta y petición de la API REST NestJS (EventsController / EventsService).
 */

/**
 * DTO que representa un evento básico tal como es devuelto por la API externa.
 *
 * - **¿Qué hace?**:
 *   Estructura los datos JSON de un evento: UUID, título, descripción, fechas en formato string,
 *   objetos anidados de zona y lugar, dirección, origen, estado, visibilidad, capacidad, precio de boleto (string o número),
 *   objeto anidado del autor y marcas temporales de auditoría.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Es recibido por `HttpEventRepository` y transformado
 *   hacia la entidad de dominio `Event` mediante el mapper `toEvent`.
 *
 * - **¿Cuál es su importancia?**:
 *   Define el contrato de transporte estricto con el backend, contemplando particularidades
 *   como el tipo `numeric` de PostgreSQL que viaja como string en `ticketPrice`.
 */
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
  /** Tipo numérico de PostgreSQL serializado como string ("45000.00") o número. */
  ticketPrice: string | number | null;
  createdBy: { id: number; username: string; fullName: string };
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO que representa una evidencia asociada a un reporte.
 */
export interface EvidenceDto {
  id: number;
  type: string;
  url: string;
  caption: string | null;
}

/**
 * DTO para la respuesta exhaustiva del endpoint `GET /events/:id`.
 *
 * - **¿Qué hace?**: Extiende `EventDto` añadiendo el número de asistentes (`attendeeCount`), evidencias opcionales y motivo de rechazo.
 * - **¿Cómo interactúa con el sistema en general?**: Recibido por `HttpEventRepository.findById` y convertido en `EventDetail` mediante `toEventDetail`.
 * - **¿Cuál es su importancia?**: Proporciona el payload completo para la pantalla de detalle de eventos.
 */
export interface EventDetailDto extends EventDto {
  attendeeCount: number;
  evidences?: EvidenceDto[];
  rejectionReason: string | null;
}

/**
 * DTO para la respuesta paginada de `GET /events`.
 *
 * - **¿Qué hace?**: Estructura el listado paginado con array de eventos `data`, totales y páginas.
 * - **¿Cómo interactúa con el sistema en general?**: Transformado a `EventPage` por `toEventPage`.
 * - **¿Cuál es su importancia?**: Soporta la paginación de la cartelera de eventos.
 */
export interface EventPageDto {
  data: EventDto[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/**
 * DTO para el cuerpo de petición de `POST /events/report` y `PATCH /events/:id`.
 *
 * - **¿Qué hace?**: Modela los campos esperados por `CreateReportDto` / `UpdateEventDto` en el backend.
 * - **¿Cómo interactúa con el sistema en general?**: Producido por los mappers `toReportEventBody` y `toUpdateEventBody`.
 * - **¿Cuál es su importancia?**: Cumple estrictamente con las reglas de validación (class-validator) del servidor NestJS.
 */
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
