// src/features/users/domain/errors/user-errors.ts
import { DomainError } from '@/shared/domain/errors/domain-error';

export class EmailAlreadyInUseError extends DomainError {
  constructor(readonly email: string) {
    super(`El email ${email} ya está registrado`);
  }
}

export class UsernameAlreadyInUseError extends DomainError {
  constructor(readonly username: string) {
    super(`El nombre de usuario ${username} ya está en uso`);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(readonly userId: number) {
    super(`El usuario ${userId} no existe`);
  }
}

export class ForbiddenActionError extends DomainError {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message);
  }
}

export class SelfDemotionError extends DomainError {
  constructor() {
    super('No puedes quitarte tu propio rol ADMIN');
  }
}
export class InvalidUserError extends DomainError {
  constructor(message = "El usuario no es válido") {
    super(message);
  }
}
