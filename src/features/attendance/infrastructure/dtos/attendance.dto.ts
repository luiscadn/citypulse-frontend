import type { AttendanceStatus } from "../../domain/entities/attendance";

/** Respuesta de GET /attendance/event/:eventId/me. */
export interface MyAttendanceDto {
  status: AttendanceStatus | null;
}

/** Elemento de los listados de asistencia: solo los campos que se usan (el backend trae más, se ignoran). */
export interface EventAttendanceDto {
  status: AttendanceStatus;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}
