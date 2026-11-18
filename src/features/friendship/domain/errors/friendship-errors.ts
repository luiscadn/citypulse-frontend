import { DomainError } from "@/shared/domain/errors/domain-error";

/** Error: El término de búsqueda de usuarios tiene menos de 2 caracteres. */
export class FriendSearchTooShortError extends DomainError {
  constructor(message = "Escribe al menos 2 letras para buscar") {
    super(message);
  }
}

/** Error: El ID del usuario destinatario de la amistad no es un entero positivo válido. */
export class InvalidFriendTargetError extends DomainError {
  constructor(message = "Este usuario no es válido") {
    super(message);
  }
}

/** Error: El usuario intenta enviarse una solicitud de amistad a sí mismo. */
export class SelfFriendRequestError extends DomainError {
  constructor(message = "No puedes enviarte una solicitud a ti mismo") {
    super(message);
  }
}

/** Error: El usuario objetivo ya no existe en el sistema o fue eliminado (HTTP 404). */
export class FriendTargetNotFoundError extends DomainError {
  constructor(message = "Este usuario ya no existe") {
    super(message);
  }
}

/** Error: Ya existe una relación o solicitud activa o previa con este usuario (HTTP 409). */
export class FriendRequestAlreadyExistsError extends DomainError {
  constructor(message = "Ya existe una solicitud de amistad con este usuario") {
    super(message);
  }
}

/** Error: La solicitud de amistad que se intenta responder ya no existe (HTTP 404). */
export class FriendRequestNotFoundError extends DomainError {
  constructor(message = "Esta solicitud ya no existe") {
    super(message);
  }
}

/** Error: La solicitud de amistad ya fue previamente respondida (HTTP 400). */
export class FriendRequestAlreadyAnsweredError extends DomainError {
  constructor(message = "Esta solicitud ya fue respondida") {
    super(message);
  }
}

/** Error: Un usuario no autorizado intenta responder una solicitud de amistad ajena (HTTP 403). */
export class FriendRequestForbiddenError extends DomainError {
  constructor(message = "Solo quien recibió la solicitud puede responderla") {
    super(message);
  }
}
