import { DomainError } from "@/shared/domain/errors/domain-error";

/**
 * Error: InvalidAttendanceEventError
 *
 * - **¿Qué hace?**: Se lanza cuando el formato del identificador de evento (`eventId`) no corresponde a un UUID v4 válido.
 * - **¿Cómo interactúa con el sistema en general?**: Arrojado por la regla de dominio `assertValidAttendanceEvent`.
 * - **¿Cuál es su importancia?**: Previene consultas erróneas a endpoints con IDs sintácticamente corruptos.
 */
export class InvalidAttendanceEventError extends DomainError {
  constructor(message = "Este evento no es válido") {
    super(message);
  }
}

/**
 * Error: InvalidAttendanceStatusError
 *
 * - **¿Qué hace?**: Se lanza cuando el estado de asistencia no coincide con ningún valor de `ATTENDANCE_STATUSES`.
 * - **¿Cómo interactúa con el sistema en general?**: Arrojado por `assertValidAttendanceStatus` en `RespondAttendanceUseCase`.
 * - **¿Cuál es su importancia?**: Evita enviar cadenas arbitrarias que el backend rechazaría en tiempo de validación de esquema.
 */
export class InvalidAttendanceStatusError extends DomainError {
  constructor(message = "Esta respuesta de asistencia no es válida") {
    super(message);
  }
}

/**
 * Error: AttendanceEventNotFoundError
 *
 * - **¿Qué hace?**: Indica que el evento al que se intenta consultar o responder asistencia ya no existe en el sistema.
 * - **¿Cómo interactúa con el sistema en general?**: Se mapea desde respuestas HTTP 404 en `HttpAttendanceRepository`.
 * - **¿Cuál es su importancia?**: Permite alertar al usuario si el evento fue cancelado o purgado mientras navegaba.
 */
export class AttendanceEventNotFoundError extends DomainError {
  constructor(message = "Este evento ya no existe") {
    super(message);
  }
}

/**
 * Error: AttendanceEventForbiddenError
 *
 * - **¿Qué hace?**: Se lanza cuando un usuario intenta confirmar asistencia a un evento privado para el cual no cuenta con invitación aceptada.
 * - **¿Cómo interactúa con el sistema en general?**: Se mapea desde respuestas HTTP 403 en `HttpAttendanceRepository.respond`.
 * - **¿Cuál es su importancia?**: Informa con claridad que el acceso a eventos privados está restringido a invitados directos.
 */
export class AttendanceEventForbiddenError extends DomainError {
  constructor(message = "No tienes acceso a este evento privado") {
    super(message);
  }
}

/**
 * Error: AttendeesForbiddenError
 *
 * - **¿Qué hace?**: Se lanza cuando un usuario no autorizado intenta consultar la lista completa de asistentes a un evento.
 * - **¿Cómo interactúa con el sistema en general?**: El backend reserva esta consulta únicamente para el autor del evento o administradores (HTTP 403).
 * - **¿Cuál es su importancia?**: Protege la privacidad de los asistentes impidiendo que usuarios comunes extraigan la lista total de participantes.
 */
export class AttendeesForbiddenError extends DomainError {
  constructor(message = "Solo el autor o un administrador puede ver los asistentes") {
    super(message);
  }
}
