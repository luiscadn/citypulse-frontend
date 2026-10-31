import { DomainError } from "@/shared/domain/errors/domain-error";

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
