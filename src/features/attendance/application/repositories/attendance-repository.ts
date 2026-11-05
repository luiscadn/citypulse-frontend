import type { AttendanceStatus, EventAttendance } from "../../domain/entities/attendance";

/** Puerto: lo que la aplicación necesita del backend para manejar la asistencia. */
export interface AttendanceRepository {
  getMyStatus(eventId: string): Promise<AttendanceStatus | null>;
  respond(eventId: string, status: AttendanceStatus): Promise<void>;
  getAttendees(eventId: string): Promise<readonly EventAttendance[]>;
  getFriendsAttendance(eventId: string): Promise<readonly EventAttendance[]>;
}
