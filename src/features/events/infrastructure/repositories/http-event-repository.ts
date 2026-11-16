import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { EventRepository } from "../../application/repositories/event-repository";
import type { Event, EventDetail, EventFilters, EventInput, EventPage } from "../../domain/entities/event";
import {
  EventAlreadyCancelledError,
  EventForbiddenError,
  EventNotEditableError,
  EventNotFoundError,
  EventPrivateError,
  EventZoneNotFoundError,
} from "../../domain/errors/event-errors";
import { colombiaDayEndIso, colombiaDayStartIso } from "../../domain/rules/event-input";
import { EVENTS_PAGE_SIZE } from "../../domain/rules/event-limits";
import type { EventDetailDto, EventDto, EventPageDto } from "../dtos/event.dto";
import {
  toEvent,
  toEventDetail,
  toEventPage,
  toReportEventBody,
  toUpdateEventBody,
} from "../mappers/event.mapper";

function isStatus(error: unknown, status: number): boolean {
  return error instanceof HttpError && error.status === status;
}

export class HttpEventRepository implements EventRepository {
  constructor(private readonly http: HttpClient) {}

  async list(filters: EventFilters): Promise<EventPage> {
    const params = new URLSearchParams({ page: String(filters.page), limit: String(EVENTS_PAGE_SIZE) });
    if (filters.zoneId !== null) params.set("zoneId", String(filters.zoneId));
    if (filters.status !== null) params.set("status", filters.status);
    if (filters.origin !== null) params.set("origin", filters.origin);
    if (filters.search !== null) params.set("search", filters.search);
    if (filters.from !== null) params.set("from", colombiaDayStartIso(filters.from));
    if (filters.to !== null) params.set("to", colombiaDayEndIso(filters.to));
    return toEventPage(await this.http.get<EventPageDto>(`/events?${params}`));
  }

  async findById(id: string): Promise<EventDetail> {
    try {
      return toEventDetail(await this.http.get<EventDetailDto>(`/events/${id}`));
    } catch (error) {
      if (isStatus(error, 403)) throw new EventPrivateError();
      if (isStatus(error, 404)) throw new EventNotFoundError();
      throw error;
    }
  }

  async report(input: EventInput): Promise<Event> {
    try {
      return toEvent(await this.http.post<EventDto>("/events/report", toReportEventBody(input)));
    } catch (error) {
      // Al reportar, el único 404 posible es el de la zona
      if (isStatus(error, 404)) throw new EventZoneNotFoundError();
      throw error;
    }
  }

  async update(id: string, input: EventInput): Promise<Event> {
    try {
      return toEvent(await this.http.patch<EventDto>(`/events/${id}`, toUpdateEventBody(input)));
    } catch (error) {
      if (isStatus(error, 403)) throw new EventForbiddenError();
      if (isStatus(error, 404)) throw new EventNotFoundError("Este evento o la zona elegida ya no existe");
      // Este 400 solo se distingue por su texto; los de validación ya los atrapó el dominio
      if (error instanceof HttpError && error.status === 400 && /REPORTADO/.test(String(bodyMessage(error)))) {
        throw new EventNotEditableError();
      }
      throw error;
    }
  }

  async cancel(id: string): Promise<void> {
    try {
      await this.http.delete(`/events/${id}`);
    } catch (error) {
      if (isStatus(error, 403)) throw new EventForbiddenError();
      if (isStatus(error, 404)) throw new EventNotFoundError();
      if (isStatus(error, 400)) throw new EventAlreadyCancelledError();
      throw error;
    }
  }
}

function bodyMessage(error: HttpError): string {
  const message = (error.body as { message?: string | string[] } | null)?.message;
  return Array.isArray(message) ? message.join(" ") : (message ?? "");
}
