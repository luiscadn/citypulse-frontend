import { DomainError } from "@/shared/domain/errors/domain-error";

export class InvalidFriendTargetError extends DomainError {
  constructor(message = "Escribe un ID de usuario válido") {
    super(message);
  }
}

export class SelfFriendRequestError extends DomainError {
  constructor(message = "No puedes enviarte una solicitud a ti mismo") {
    super(message);
  }
}

export class FriendTargetNotFoundError extends DomainError {
  constructor(message = "No encontramos un usuario con ese ID") {
    super(message);
  }
}

/** El backend conserva la solicitud aunque haya sido rechazada: tampoco se puede repetir. */
export class FriendRequestAlreadyExistsError extends DomainError {
  constructor(message = "Ya existe una solicitud de amistad con este usuario") {
    super(message);
  }
}

export class FriendRequestNotFoundError extends DomainError {
  constructor(message = "Esta solicitud ya no existe") {
    super(message);
  }
}

export class FriendRequestAlreadyAnsweredError extends DomainError {
  constructor(message = "Esta solicitud ya fue respondida") {
    super(message);
  }
}

export class FriendRequestForbiddenError extends DomainError {
  constructor(message = "Solo quien recibió la solicitud puede responderla") {
    super(message);
  }
}
