import { DomainError } from "@/shared/domain/errors/domain-error";
import { ZONE_DESCRIPTION_MAX_LENGTH, ZONE_NAME_MAX_LENGTH } from "../rules/zone-limits";

export class ZoneNameRequiredError extends DomainError {
  constructor(message = "El nombre de la zona es obligatorio") {
    super(message);
  }
}

export class ZoneNameTooLongError extends DomainError {
  constructor(message = `El nombre no puede superar ${ZONE_NAME_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class ZoneDescriptionTooLongError extends DomainError {
  constructor(message = `La descripción no puede superar ${ZONE_DESCRIPTION_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

export class InvalidZoneError extends DomainError {
  constructor(message = "La zona no es válida") {
    super(message);
  }
}

export class ZoneSelfParentError extends DomainError {
  constructor(message = "Una zona no puede ser su propia zona padre") {
    super(message);
  }
}

export class ZoneNotFoundError extends DomainError {
  constructor(message = "Esta zona ya no existe") {
    super(message);
  }
}

export class ZoneParentNotFoundError extends DomainError {
  constructor(message = "La zona padre ya no existe") {
    super(message);
  }
}

/** El nombre de la zona es único en todo el sistema. */
export class ZoneNameTakenError extends DomainError {
  constructor(message = "Ya existe una zona con ese nombre") {
    super(message);
  }
}

/** El backend no borra una zona que tenga lugares o eventos (FK RESTRICT). */
export class ZoneInUseError extends DomainError {
  constructor(message = "No se puede eliminar: la zona tiene lugares o eventos asociados") {
    super(message);
  }
}
