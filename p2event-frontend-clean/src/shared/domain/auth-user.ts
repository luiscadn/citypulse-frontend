// src/shared/domain/auth-user.ts
import type { RoleName } from './enums';

/** El "usuario de sesión" del frontend.
 *  NO es el AuthUser interno del backend: este vive en el estado global
 *  de React y representa lo que la UI sabe del usuario autenticado. */
export interface AuthUser {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly roles: readonly RoleName[];
}
