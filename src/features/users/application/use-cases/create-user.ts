// src/features/users/application/use-cases/create-user.ts
import type { User, CreateUserParams } from '../../domain/entities/user';
import type { UserRepository } from '../repositories/user-repository';

export type CreateUser = (params: CreateUserParams) => Promise<User>;

interface Deps { users: UserRepository }

export function makeCreateUser({ users }: Deps): CreateUser {
  return async (params) => {
    // Validación de dominio ANTES de pegarle al backend (UX rápida).
    // El backend valida de nuevo (seguridad): doble defensa.
    if (params.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    return users.create(params);
  };
}