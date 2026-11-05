import { DomainError } from "@/shared/domain/errors/domain-error";

export class InvalidAttendanceEventError extends DomainError {
  constructor(message = "Este evento no es válido") {
    super(message);
  }
}

export class InvalidAttendanceStatusError extends DomainError {
  constructor(message = "Esta respuesta de asistencia no es válida") {
    super(message);
  }
}

export class AttendanceEventNotFoundError extends DomainError {
  constructor(message = "Este evento ya no existe") {
    super(message);
  }
}

export class AttendanceEventForbiddenError extends DomainError {
  constructor(message = "No tienes acceso a este evento privado") {
    super(message);
  }
}

export class AttendeesForbiddenError extends DomainError {
  constructor(message = "Solo el autor o un administrador puede ver los asistentes") {
    super(message);
  }
}
