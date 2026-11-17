import { DomainError } from "@/shared/domain/errors/domain-error";
import {
  EVENT_ADDRESS_MAX_LENGTH,
  EVENT_TITLE_MAX_LENGTH,
  EVIDENCE_CAPTION_MAX_LENGTH,
  EVIDENCE_URL_MAX_LENGTH,
  REJECTION_REASON_MAX_LENGTH,
} from "../rules/event-limits";

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

export class EvidenceTypeError extends DomainError {
  constructor(message = "Elige qué tipo de evidencia es") {
    super(message);
  }
}

export class EvidenceUrlError extends DomainError {
  constructor(message = `Escribe un enlace válido (http o https) de hasta ${EVIDENCE_URL_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class EvidenceCaptionTooLongError extends DomainError {
  constructor(message = `La descripción no puede superar ${EVIDENCE_CAPTION_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class RejectionReasonRequiredError extends DomainError {
  constructor(message = "Escribe el motivo del rechazo") {
    super(message);
  }
}

export class RejectionReasonTooLongError extends DomainError {
  constructor(message = `El motivo no puede superar ${REJECTION_REASON_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/** El backend solo confirma reportes con al menos una evidencia (RF-3.4). */
export class ReportWithoutEvidenceError extends DomainError {
  constructor(message = "El reporte necesita al menos una evidencia para poder confirmarse") {
    super(message);
  }
}

/** El reporte ya lo confirmó o rechazó otro administrador. */
export class ReportAlreadyReviewedError extends DomainError {
  constructor(message = "Este reporte ya fue revisado") {
    super(message);
  }
}

export class OfficialVenueRequiredError extends DomainError {
  constructor(message = "Elige uno de tus lugares") {
    super(message);
  }
}

/** Un evento oficial solo se publica en un lugar propio. */
export class OfficialVenueForbiddenError extends DomainError {
  constructor(message = "Solo puedes publicar eventos en tus propios lugares") {
    super(message);
  }
}

export class EventCapacityError extends DomainError {
  constructor(message = "La capacidad debe ser un número entero mayor que cero") {
    super(message);
  }
}

export class EventTicketPriceError extends DomainError {
  constructor(message = "El precio debe ser un número mayor o igual a cero, con máximo dos decimales") {
    super(message);
  }
}

export class EventVisibilityError extends DomainError {
  constructor(message = "Elige si el evento es público o privado") {
    super(message);
  }
}
