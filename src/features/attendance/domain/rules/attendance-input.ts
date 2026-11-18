import { ATTENDANCE_STATUSES, type AttendanceStatus } from "../entities/attendance";
import { InvalidAttendanceEventError, InvalidAttendanceStatusError } from "../errors/attendance-errors";

/** Expresión regular estándar para la validación estricta de cadenas UUID v4 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Función assertValidAttendanceEvent
 *
 * - **¿Qué hace?**: Verifica mediante regex que el `eventId` tenga la forma de un UUID válido; si no coincide, arroja `InvalidAttendanceEventError`.
 * - **¿Cómo interactúa con el sistema en general?**: Es el guardia de entrada de todos los casos de uso del módulo de asistencia.
 * - **¿Cuál es su importancia?**: Previene peticiones HTTP defectuosas hacia el backend y garantiza consistencia de identificadores en la capa de aplicación.
 */
export function assertValidAttendanceEvent(eventId: string): void {
  if (!UUID.test(eventId)) {
    throw new InvalidAttendanceEventError();
  }
}

/**
 * Función assertValidAttendanceStatus (Type Assertion Function)
 *
 * - **¿Qué hace?**: Comprueba en tiempo de ejecución que el texto `status` coincida con uno de los valores permitidos (`ATTENDANCE_STATUSES`).
 *   Si la comprobación pasa, TypeScript infiere automáticamente el tipo estrecho `AttendanceStatus`. Si no, arroja `InvalidAttendanceStatusError`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada por `RespondAttendanceUseCase` al recibir entradas crudas de formularios o botones.
 * - **¿Cuál es su importancia?**: Brinda seguridad estricta de tipos ("runtime type narrowing"), puenteando datos no tipados de la interfaz
 *   hacia el dominio con garantía matemática de corrección.
 */
export function assertValidAttendanceStatus(status: string): asserts status is AttendanceStatus {
  if (!ATTENDANCE_STATUSES.includes(status as AttendanceStatus)) {
    throw new InvalidAttendanceStatusError();
  }
}
