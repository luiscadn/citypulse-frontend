/**
 * @file http-event-repository.ts
 * @description Adaptador de Infraestructura que implementa el puerto `EventRepository`.
 * Realiza las peticiones HTTP contra la API REST externa utilizando el cliente compartido,
 * traduciendo respuestas y códigos de estado en entidades y excepciones de Dominio.
 */

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

/**
 * Comprueba si un error es un `HttpError` con un código de estado determinado.
 */
function isStatus(error: unknown, status: number): boolean {
  return error instanceof HttpError && error.status === status;
}

/**
 * Implementación HTTP de `EventRepository` conectada a los endpoints de `/events` de la API NestJS.
 *
 * - **¿Qué hace?**:
 *   Gestiona las consultas y mutaciones de red para listar eventos filtrados, consultar detalle por UUID,
 *   reportar eventos comunitarios, actualizar reportes en revisión y cancelar eventos,
 *   traduciendo códigos HTTP (400, 403, 404) a errores expresivos del dominio.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Instanciado en `event.container.ts` pasando `serverHttp`
 *   e inyectado en todos los casos de uso de eventos.
 *
 * - **¿Cuál es su importancia?**:
 *   Encapsula las llamadas REST, los query parameters y el manejo de excepciones de red,
 *   permitiendo que el resto del sistema opere con interfaces y modelos puros de dominio.
 */
export class HttpEventRepository implements EventRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Consulta el listado de eventos con filtros aplicados.
   *
   * - **¿Qué hace?**: Serializa filtros a query params (incluyendo cálculo de instantes UTC para fechas locales) y efectúa `GET /events`.
   * - **¿Cómo interactúa con el sistema en general?**: Transforma la respuesta con `toEventPage` y la devuelve a `ListEventsUseCase`.
   * - **¿Cuál es su importancia?**: Proporciona el soporte de datos dinámico para la cartelera general.
   */
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

  /**
   * Obtiene la información detallada de un evento por su UUID.
   *
   * - **¿Qué hace?**: Realiza `GET /events/:id`. Mapea 403 a `EventPrivateError` y 404 a `EventNotFoundError`.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad extendida `EventDetail` al caso de uso.
   * - **¿Cuál es su importancia?**: Abastece la página de detalle con información completa y segura.
   */
  async findById(id: string): Promise<EventDetail> {
    try {
      return toEventDetail(await this.http.get<EventDetailDto>(`/events/${id}`));
    } catch (error) {
      if (isStatus(error, 403)) throw new EventPrivateError();
      if (isStatus(error, 404)) throw new EventNotFoundError();
      throw error;
    }
  }

  /**
   * Registra un nuevo reporte ciudadano de evento.
   *
   * - **¿Qué hace?**: Envía `POST /events/report` con el cuerpo preparado por `toReportEventBody`. Traduce 404 a `EventZoneNotFoundError`.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna el nuevo evento creado a `ReportEventUseCase`.
   * - **¿Cuál es su importancia?**: Facilita la creación comunitaria de eventos gestionando la integridad referencial.
   */
  async report(input: EventInput): Promise<Event> {
    try {
      return toEvent(await this.http.post<EventDto>("/events/report", toReportEventBody(input)));
    } catch (error) {
      if (isStatus(error, 404)) throw new EventZoneNotFoundError();
      throw error;
    }
  }

  /**
   * Actualiza los datos de un evento en revisión.
   *
   * - **¿Qué hace?**: Ejecuta `PATCH /events/:id` con `toUpdateEventBody`. Traduce 403 a `EventForbiddenError`, 404 a `EventNotFoundError` y 400 por estado a `EventNotEditableError`.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna el evento actualizado a `UpdateEventUseCase`.
   * - **¿Cuál es su importancia?**: Asegura modificaciones válidas conforme al estado de moderación del evento.
   */
  async update(id: string, input: EventInput): Promise<Event> {
    try {
      return toEvent(await this.http.patch<EventDto>(`/events/${id}`, toUpdateEventBody(input)));
    } catch (error) {
      if (isStatus(error, 403)) throw new EventForbiddenError();
      if (isStatus(error, 404)) throw new EventNotFoundError("Este evento o la zona elegida ya no existe");
      if (error instanceof HttpError && error.status === 400 && /REPORTADO/.test(String(bodyMessage(error)))) {
        throw new EventNotEditableError();
      }
      throw error;
    }
  }

  /**
   * Cancela un evento previamente registrado.
   *
   * - **¿Qué hace?**: Ejecuta `DELETE /events/:id`. Traduce 403 a `EventForbiddenError`, 404 a `EventNotFoundError` y 400 a `EventAlreadyCancelledError`.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `CancelEventUseCase`.
   * - **¿Cuál es su importancia?**: Centraliza la petición de desconvocatoria de eventos con control semántico de estados.
   */
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

/**
 * Extrae y concatena los mensajes de error devueltos en el cuerpo JSON de una respuesta HttpError.
 */
function bodyMessage(error: HttpError): string {
  const message = (error.body as { message?: string | string[] } | null)?.message;
  return Array.isArray(message) ? message.join(" ") : (message ?? "");
}
