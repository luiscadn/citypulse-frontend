// src/features/users/domain/entities/user.ts
import type { RoleName } from '@/shared/domain/enums';

/** PROYECCIÓN de lo que la UI necesita. NO es el User de TypeORM.
 *  - Sin passwordHash (secreto)
 *  - Sin twoFactorSecret (secreto)
 *  - Sin deletedAt (a menos que la UI tenga "papelera")
 *  - Sin createdAt/updatedAt crudos si la UI los formatea a Date */
export interface User {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly fullName: string;
  readonly roles: readonly RoleName[];
  readonly isActive: boolean;
  readonly twoFactorEnabled: boolean;
  readonly zoneId: number | null;
  readonly createdAt: Date;
}

/** Parámetros para crear un usuario. Más chico que el DTO del backend:
 *  el backend agrega passwordHash, userRoles, isActive, etc. por su cuenta. */
export interface CreateUserParams {
  email: string;
  username: string;
  fullName: string;
  password: string;
}

/** Parámetros para actualizar. Todo opcional, salvo password que se re-hashea. */
export type UpdateUserParams = Partial<CreateUserParams>;