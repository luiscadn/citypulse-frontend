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

export class HttpAttendanceRepository implements AttendanceRepository {
  constructor(private readonly http: HttpClient) {}

  async getMyStatus(eventId: string): Promise<AttendanceStatus | null> {
    try {
      const dto = await this.http.get<MyAttendanceDto>(`/attendance/event/${eventId}/me`);
      return dto.status;
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) throw new AttendanceEventNotFoundError();
      throw error;
    }
  }

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
