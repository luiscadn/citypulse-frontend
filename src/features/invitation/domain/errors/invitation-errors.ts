import { DomainError } from "@/shared/domain/errors/domain-error";

/** Error: El ID del evento de la invitación no tiene formato UUID v4 válido. */
export class InvalidInvitationEventError extends DomainError {
  constructor(message = "Este evento no es válido") {
    super(message);
  }
}

/** Error: El ID del usuario destinatario no es un entero positivo válido. */
export class InvalidInvitationTargetError extends DomainError {
  constructor(message = "Este usuario no es válido") {
    super(message);
  }
}

/** Error: El usuario intenta enviarse una invitación a sí mismo. */
export class SelfInvitationError extends DomainError {
  constructor(message = "No puedes invitarte a ti mismo") {
    super(message);
  }
}

/** Error: El mensaje opcional de la invitación supera el límite de 255 caracteres. */
export class InvitationMessageTooLongError extends DomainError {
  constructor(message = "El mensaje no puede superar los 255 caracteres") {
    super(message);
  }
}

/** Error: El evento asociado a la invitación fue eliminado o no existe en la base de datos. */
export class InvitationEventNotFoundError extends DomainError {
  constructor(message = "Este evento ya no existe") {
    super(message);
  }
}

/** Error: No se puede invitar porque los usuarios no son amigos o el remitente no tiene acceso al evento privado (HTTP 403). */
export class InvitationNotAllowedError extends DomainError {
  constructor(message = "Solo puedes invitar a tus amigos a eventos a los que tienes acceso") {
    super(message);
  }
}

/** Error: Ya existe una invitación previa para ese mismo usuario y evento (HTTP 409). */
export class InvitationAlreadyExistsError extends DomainError {
  constructor(message = "Ya invitaste a este amigo a este evento") {
    super(message);
  }
}

/** Error: La invitación que se intenta responder ya no existe (HTTP 404). */
export class InvitationNotFoundError extends DomainError {
  constructor(message = "Esta invitación ya no existe") {
    super(message);
  }
}

/** Error: La invitación ya fue previamente aceptada o rechazada (HTTP 400). */
export class InvitationAlreadyAnsweredError extends DomainError {
  constructor(message = "Esta invitación ya fue respondida") {
    super(message);
  }
}

/** Error: Un usuario distinto del receptor intenta responder la invitación (HTTP 403). */
export class InvitationForbiddenError extends DomainError {
  constructor(message = "Solo quien recibió la invitación puede responderla") {
    super(message);
  }
}
