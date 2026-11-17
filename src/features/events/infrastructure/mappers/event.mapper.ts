import type { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import {
  createEvent,
  createEventDetail,
  createPendingReport,
  type Event,
  type EventDetail,
  type EventEvidence,
  type EventInput,
  type EventPage,
  type EvidenceInput,
  type EvidenceType,
  type OfficialEventInput,
  type PendingReport,
} from "../../domain/entities/event";
import type {
  EventBodyDto,
  EventDetailDto,
  EventDto,
  EventPageDto,
  EvidenceBodyDto,
  EvidenceDto,
  OfficialEventBodyDto,
  PendingReportDto,
} from "../dtos/event.dto";

/** Solo copia lo que usa la UI: del autor, nunca más que id, usuario y nombre. */
export function toEvent(dto: EventDto): Event {
  return createEvent({
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
  });
}

function toEvidence(dto: EvidenceDto): EventEvidence {
  return { id: dto.id, type: dto.type as EvidenceType, url: dto.url, caption: dto.caption ?? null };
}

export function toEventDetail(dto: EventDetailDto): EventDetail {
  return createEventDetail({
    ...toEvent(dto),
    attendeeCount: dto.attendeeCount,
    evidences: (dto.evidences ?? []).map(toEvidence),
    rejectionReason: dto.rejectionReason ?? null,
  });
}

export function toEventPage(dto: EventPageDto): EventPage {
  return {
    events: dto.data.map(toEvent),
    total: dto.total,
    page: dto.page,
    // Sin resultados el backend responde lastPage 0: siempre hay al menos una página
    lastPage: Math.max(dto.lastPage, 1),
  };
}

/** Al reportar, los textos vacíos no se envían. */
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
 * Al editar, descripción y dirección van siempre. El backend solo asigna lo que llega y
 * su DTO pide texto, así que un campo vaciado se manda como "".
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

export function toPendingReport(dto: PendingReportDto): PendingReport {
  return createPendingReport({ ...toEvent(dto), evidences: dto.evidences.map(toEvidence) });
}

/** Al publicar, lo opcional vacío no se envía. */
export function toOfficialEventBody(input: OfficialEventInput): OfficialEventBodyDto {
  return {
    ...toReportEventBody(input),
    venueId: input.venueId,
    visibility: input.visibility,
    ...(input.capacity !== null && { capacity: input.capacity }),
    ...(input.ticketPrice !== null && { ticketPrice: input.ticketPrice }),
  };
}

export function toEvidenceBody(input: EvidenceInput): EvidenceBodyDto {
  return { type: input.type, url: input.url, ...(input.caption && { caption: input.caption }) };
}
