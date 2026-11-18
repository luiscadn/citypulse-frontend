/**
 * @file event.mapper.ts
 * @description Mapeadores de Infraestructura para transformar entre DTOs de red y Entidades de Dominio de Eventos.
 * Implementa el patrón Anti-Corruption Layer (ACL) para salvaguardar la pureza del modelo de dominio.
 */

import type { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import type {
  Event,
  EventDetail,
  EventEvidence,
  EventInput,
  EventPage,
  EvidenceType,
} from "../../domain/entities/event";
import type { EventBodyDto, EventDetailDto, EventDto, EventPageDto, EvidenceDto } from "../dtos/event.dto";

/**
 * Transforma un DTO `EventDto` en una entidad inmutable de dominio `Event`.
 *
 * - **¿Qué hace?**:
 *   Mapea los campos primarios, convierte valores en los enums tipados de dominio (`EventOrigin`, `EventStatus`, `EventVisibility`),
 *   convierte el precio textual de PostgreSQL a número (`Number(dto.ticketPrice)`), asegura `null` en opcionales,
 *   y filtra la información pública del autor (solo `id`, `username`, `fullName`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en todas las transformaciones de repositorios para proveer eventos limpios a la capa de aplicación.
 *
 * - **¿Cuál es su importancia?**:
 *   Aísla al dominio de tipos crudos de transporte (evitando por ejemplo que `ticketPrice` string contamine el dominio numérico).
 */
export function toEvent(dto: EventDto): Event {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? null,
    startDate: dto.startDate,
    endDate: dto.endDate,
    zone: { id: dto.zone.id, name: dto.zone.name },
    venue: dto.venue ? { id: dto.venue.id, name: dto.venue.name } : null,
    addressText: dto.addressText ?? null,
    origin: dto.origin as EventOrigin,
    status: dto.status as EventStatus,
    visibility: dto.visibility as EventVisibility,
    capacity: dto.capacity ?? null,
    ticketPrice: dto.ticketPrice === null || dto.ticketPrice === undefined ? null : Number(dto.ticketPrice),
    createdBy: { id: dto.createdBy.id, username: dto.createdBy.username, fullName: dto.createdBy.fullName },
  };
}

/**
 * Transforma un `EvidenceDto` en la entidad de dominio `EventEvidence`.
 */
function toEvidence(dto: EvidenceDto): EventEvidence {
  return { id: dto.id, type: dto.type as EvidenceType, url: dto.url, caption: dto.caption ?? null };
}

/**
 * Transforma un `EventDetailDto` en una entidad de dominio extendida `EventDetail`.
 *
 * - **¿Qué hace?**: Reutiliza `toEvent` para los atributos base y mapea `attendeeCount`, la lista de evidencias y el motivo de rechazo.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.findById`.
 * - **¿Cuál es su importancia?**: Conforma la entidad completa requerida por la vista de detalle del evento.
 */
export function toEventDetail(dto: EventDetailDto): EventDetail {
  return {
    ...toEvent(dto),
    attendeeCount: dto.attendeeCount,
    evidences: (dto.evidences ?? []).map(toEvidence),
    rejectionReason: dto.rejectionReason ?? null,
  };
}

/**
 * Transforma una respuesta paginada `EventPageDto` en el objeto de dominio `EventPage`.
 *
 * - **¿Qué hace?**: Mapea la lista de eventos con `toEvent` y normaliza `lastPage` asegurando un mínimo de 1.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.list`.
 * - **¿Cuál es su importancia?**: Previene estados de paginación inconsistentes en la interfaz visual cuando la búsqueda no arrojó resultados.
 */
export function toEventPage(dto: EventPageDto): EventPage {
  return {
    events: dto.data.map(toEvent),
    total: dto.total,
    page: dto.page,
    lastPage: Math.max(dto.lastPage, 1),
  };
}

/**
 * Convierte un `EventInput` en el cuerpo DTO para reportar un nuevo evento comunitario.
 *
 * - **¿Qué hace?**: Estructura `title`, `zoneId`, `startDate` y `endDate`, incluyendo `description` o `addressText` únicamente si contienen texto.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.report`.
 * - **¿Cuál es su importancia?**: Evita el envío de campos vacíos o `undefined` en peticiones `POST`.
 */
export function toReportEventBody(input: EventInput): EventBodyDto {
  return {
    title: input.title,
    zoneId: input.zoneId,
    startDate: input.startDate,
    endDate: input.endDate,
    ...(input.description && { description: input.description }),
    ...(input.addressText && { addressText: input.addressText }),
  };
}

/**
 * Convierte un `EventInput` en el cuerpo DTO para actualizar un evento existente.
 *
 * - **¿Qué hace?**: Envía todos los campos incluyendo descripción y dirección, asignando cadena vacía `""` si fueron eliminadas para que el backend las limpie.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.update`.
 * - **¿Cuál es su importancia?**: Permite limpiar campos opcionales en el backend durante operaciones `PATCH`.
 */
export function toUpdateEventBody(input: EventInput): EventBodyDto {
  return {
    title: input.title,
    zoneId: input.zoneId,
    startDate: input.startDate,
    endDate: input.endDate,
    description: input.description ?? "",
    addressText: input.addressText ?? "",
  };
}
