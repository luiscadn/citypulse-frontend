import type { AttendanceStatus, EventAttendance } from "../../domain/entities/attendance";

/**
 * Puerto AttendanceRepository (Arquitectura Hexagonal / Limpia)
 *
 * - **¿Qué hace?**: Define las operaciones de asistencia requeridas por el frontend:
 *   consultar mi propio estado (`getMyStatus`), registrar o actualizar respuesta (`respond`),
 *   listar todos los asistentes de un evento (`getAttendees`, restringido) y listar la asistencia de amigos (`getFriendsAttendance`).
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Su implementación concreta
 *   es `HttpAttendanceRepository`.
 * - **¿Cuál es su importancia?**: Desacopla la lógica de negocio de la asistencia de la implementación concreta de transporte HTTP,
 *   permitiendo mockear fácilmente el comportamiento en pruebas unitarias (`attendance.use-cases.test.ts`).
 */
export interface AttendanceRepository {
  getMyStatus(eventId: string): Promise<AttendanceStatus | null>;
  respond(eventId: string, status: AttendanceStatus): Promise<void>;
  getAttendees(eventId: string): Promise<readonly EventAttendance[]>;
  getFriendsAttendance(eventId: string): Promise<readonly EventAttendance[]>;
}
