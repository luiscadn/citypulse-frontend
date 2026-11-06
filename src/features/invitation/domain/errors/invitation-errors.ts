import { DomainError } from "@/shared/domain/errors/domain-error";

export class InvalidInvitationEventError extends DomainError {
  constructor(message = "Este evento no es válido") {
    super(message);
  }
}

export class InvalidInvitationTargetError extends DomainError {
  constructor(message = "Este usuario no es válido") {
    super(message);
  }
}

export class SelfInvitationError extends DomainError {
  constructor(message = "No puedes invitarte a ti mismo") {
    super(message);
  }
}

export class InvitationMessageTooLongError extends DomainError {
  constructor(message = "El mensaje no puede superar los 255 caracteres") {
    super(message);
  }
}

export class InvitationEventNotFoundError extends DomainError {
  constructor(message = "Este evento ya no existe") {
    super(message);
  }
}

/** El backend responde 403 igual si no son amigos o si no tengo acceso a un evento privado. */
export class InvitationNotAllowedError extends DomainError {
  constructor(message = "Solo puedes invitar a tus amigos a eventos a los que tienes acceso") {
    super(message);
  }
}

/** El backend no deja repetir la invitación, aunque ya haya sido respondida. */
export class InvitationAlreadyExistsError extends DomainError {
  constructor(message = "Ya invitaste a este amigo a este evento") {
    super(message);
  }
}

export class InvitationNotFoundError extends DomainError {
  constructor(message = "Esta invitación ya no existe") {
    super(message);
  }
}

export class InvitationAlreadyAnsweredError extends DomainError {
  constructor(message = "Esta invitación ya fue respondida") {
    super(message);
  }
}

export class InvitationForbiddenError extends DomainError {
  constructor(message = "Solo quien recibió la invitación puede responderla") {
    super(message);
  }
}
