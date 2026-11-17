import { DomainError } from "@/shared/domain/errors/domain-error";
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_DESCRIPTION_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from "../rules/venue-limits";

export class VenueNameRequiredError extends DomainError {
  constructor(message = "El nombre del lugar es obligatorio") {
    super(message);
  }
}

export class VenueNameTooLongError extends DomainError {
  constructor(message = `El nombre no puede superar ${VENUE_NAME_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class VenueAddressRequiredError extends DomainError {
  constructor(message = "La dirección es obligatoria") {
    super(message);
  }
}

export class VenueAddressTooLongError extends DomainError {
  constructor(message = `La dirección no puede superar ${VENUE_ADDRESS_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class VenueDescriptionTooLongError extends DomainError {
  constructor(message = `La descripción no puede superar ${VENUE_DESCRIPTION_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class VenueZoneRequiredError extends DomainError {
  constructor(message = "Elige la zona donde está el lugar") {
    super(message);
  }
}

export class VenueLocationError extends DomainError {
  constructor(message = "La ubicación no es válida: búscala de nuevo en Google Maps") {
    super(message);
  }
}

export class InvalidVenueError extends DomainError {
  constructor(message = "El lugar no es válido") {
    super(message);
  }
}

export class VenueNotFoundError extends DomainError {
  constructor(message = "Este lugar ya no existe") {
    super(message);
  }
}

export class VenueZoneNotFoundError extends DomainError {
  constructor(message = "La zona elegida ya no existe") {
    super(message);
  }
}

/** El nombre de un lugar es único dentro de su zona. */
export class VenueNameTakenError extends DomainError {
  constructor(message = "Ya existe un lugar con ese nombre en esa zona") {
    super(message);
  }
}

export class VenueForbiddenError extends DomainError {
  constructor(message = "Solo puedes administrar tus propios lugares") {
    super(message);
  }
}
