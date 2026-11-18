import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { AttendanceRepository } from "../../application/repositories/attendance-repository";
import type { AttendanceStatus, EventAttendance } from "../../domain/entities/attendance";
import {
  AttendanceEventForbiddenError,
  AttendanceEventNotFoundError,
  AttendeesForbiddenError,
} from "../../domain/errors/attendance-errors";
import type { EventAttendanceDto, MyAttendanceDto } from "../dtos/attendance.dto";
import { toEventAttendance } from "../mappers/attendance.mapper";

/**
 * Adaptador HttpAttendanceRepository (Infraestructura en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Implementa el puerto `AttendanceRepository` ejecutando peticiones HTTP contra la API de asistencia
 *   del backend (`/attendance/event/:eventId/...`) e interceptando códigos de error (403, 404) para mapearlos
 *   a los errores de dominio correspondientes (`AttendanceEventForbiddenError`, `AttendeesForbiddenError`, `AttendanceEventNotFoundError`).
 * - **¿Cómo interactúa con el sistema en general?**: Se instancia e inyecta en los casos de uso de asistencia
 *   dentro de los contenedores de dependencias correspondientes.
 * - **¿Cuál es su importancia?**: Aísla completamente el protocolo HTTP y la serialización JSON del resto de la aplicación.
 */
export class HttpAttendanceRepository implements AttendanceRepository {
  constructor(private readonly http: HttpClient) {}

  /** Consulta el estado de asistencia propio invocando `GET /attendance/event/:eventId/me`. */
  async getMyStatus(eventId: string): Promise<AttendanceStatus | null> {
    try {
      const dto = await this.http.get<MyAttendanceDto>(`/attendance/event/${eventId}/me`);
      return dto.status;
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) throw new AttendanceEventNotFoundError();
      throw error;
    }
  }

  /** Registra o actualiza la asistencia invocando `POST /attendance/event/:eventId`. */
  async respond(eventId: string, status: AttendanceStatus): Promise<void> {
    try {
      await this.http.post(`/attendance/event/${eventId}`, { status });
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 403) throw new AttendanceEventForbiddenError();
        if (error.status === 404) throw new AttendanceEventNotFoundError();
      }
      throw error;
    }
  }

  /** Consulta la lista de todos los asistentes invocando `GET /attendance/event/:eventId`. */
  async getAttendees(eventId: string): Promise<readonly EventAttendance[]> {
    try {
      const dtos = await this.http.get<EventAttendanceDto[]>(`/attendance/event/${eventId}`);
      return dtos.map(toEventAttendance);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 403) throw new AttendeesForbiddenError();
        if (error.status === 404) throw new AttendanceEventNotFoundError();
      }
      throw error;
    }
  }

  /** Consulta la asistencia de amigos invocando `GET /attendance/event/:eventId/friends`. */
  async getFriendsAttendance(eventId: string): Promise<readonly EventAttendance[]> {
    try {
      const dtos = await this.http.get<EventAttendanceDto[]>(`/attendance/event/${eventId}/friends`);
      return dtos.map(toEventAttendance);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) throw new AttendanceEventNotFoundError();
      throw error;
    }
  }
}
