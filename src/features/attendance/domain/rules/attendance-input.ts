import { ATTENDANCE_STATUSES, type AttendanceStatus } from "../entities/attendance";
import { InvalidAttendanceEventError, InvalidAttendanceStatusError } from "../errors/attendance-errors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Réplica UX de las validaciones del backend: evita una petición que ya se sabe
 * que va a fallar. Si difieren, el backend gana.
 */
export function assertValidAttendanceEvent(eventId: string): void {
  if (!UUID.test(eventId)) {
    throw new InvalidAttendanceEventError();
  }
}

/** La respuesta llega de un formulario: en ejecución puede traer cualquier texto. */
export function assertValidAttendanceStatus(status: string): asserts status is AttendanceStatus {
  if (!ATTENDANCE_STATUSES.includes(status as AttendanceStatus)) {
    throw new InvalidAttendanceStatusError();
  }
}
