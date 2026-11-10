import { DomainError } from "@/shared/domain/errors/domain-error";
import type { RegistrationErrors } from "../rules/registration";

export class InvalidCredentialsError extends DomainError {
  constructor(message = "Correo o contraseña incorrectos") {
    super(message);
  }
}

export class InvalidTwoFactorCodeError extends DomainError {
  constructor(message = "El código 2FA no es válido") {
    super(message);
  }
}

/** Los datos de registro no pasan las reglas de formato (errores por campo). */
export class InvalidRegistrationError extends DomainError {
  constructor(readonly errors: RegistrationErrors) {
    super("Revisa los datos del formulario");
  }
}

export class EmailAlreadyRegisteredError extends DomainError {
  constructor() {
    super("Ya existe una cuenta con este correo");
  }
}

export class UsernameAlreadyRegisteredError extends DomainError {
  constructor() {
    super("Este nombre de usuario ya está en uso");
  }
}

export class TwoFactorAlreadyEnabledError extends DomainError {
  constructor() {
    super("La verificación en dos pasos ya está activa");
  }
}