import { DomainError } from "@/shared/domain/errors/domain-error";
import { EVENT_ADDRESS_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH } from "../rules/event-limits";

export class EventTitleRequiredError extends DomainError {
  constructor(message = "El título del evento es obligatorio") {
    super(message);
  }
}

export class EventTitleTooLongError extends DomainError {
  constructor(message = `El título no puede superar ${EVENT_TITLE_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class EventAddressTooLongError extends DomainError {
  constructor(message = `La dirección no puede superar ${EVENT_ADDRESS_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class EventZoneRequiredError extends DomainError {
  constructor(message = "Elige la zona donde ocurre el evento") {
    super(message);
  }
}

export class EventStartDateRequiredError extends DomainError {
  constructor(message = "Indica cuándo empieza el evento") {
    super(message);
  }
}

export class EventEndDateRequiredError extends DomainError {
  constructor(message = "Indica cuándo termina el evento") {
    super(message);
  }
}

/** La fecha de fin debe ser posterior a la de inicio. */
export class EventDatesOrderError extends DomainError {
  constructor(message = "El evento debe terminar después de empezar") {
    super(message);
  }
}

export class InvalidEventError extends DomainError {
  constructor(message = "El evento no es válido") {
    super(message);
  }
}

export class EventNotFoundError extends DomainError {
  constructor(message = "Este evento ya no existe") {
    super(message);
  }
}

export class EventZoneNotFoundError extends DomainError {
  constructor(message = "La zona elegida ya no existe") {
    super(message);
  }
}

/** Un evento privado solo lo ven su autor, un ADMIN y quienes están invitados. */
export class EventPrivateError extends DomainError {
  constructor(message = "No tienes acceso a este evento privado") {
    super(message);
  }
}

export class EventForbiddenError extends DomainError {
  constructor(message = "Solo el autor del evento o un administrador puede hacer esto") {
    super(message);
  }
}

/** Un reporte solo se edita mientras sigue en revisión (REPORTADO). */
export class EventNotEditableError extends DomainError {
  constructor(message = "Solo se puede editar un reporte que aún no ha sido revisado") {
    super(message);
  }
}

export class EventAlreadyCancelledError extends DomainError {
  constructor(message = "El evento ya está cancelado") {
    super(message);
  }
}
