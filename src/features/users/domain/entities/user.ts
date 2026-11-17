// src/features/users/domain/entities/user.ts
import { RoleName } from '@/shared/domain/enums';
import { isNonBlank, isOneOf, isPositiveInt } from '@/shared/domain/invariants';
import { InvalidUserError } from '../errors/user-errors';

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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Única forma de construir un User: comprueba sus invariantes y lo congela.
 * Función y no clase: las entidades viajan a Client Components como objetos planos.
 */
export function createUser(props: User): User {
  if (!isPositiveInt(props.id)) throw new InvalidUserError('El usuario necesita un ID válido');
  if (!EMAIL_PATTERN.test(props.email)) throw new InvalidUserError('El correo del usuario no es válido');
  if (!isNonBlank(props.username)) throw new InvalidUserError('El usuario necesita un nombre de usuario');
  if (!isNonBlank(props.fullName)) throw new InvalidUserError('El usuario necesita un nombre');
  const validRoles = Object.values(RoleName);
  if (!props.roles.every((role) => isOneOf(validRoles, role))) {
    throw new InvalidUserError('El usuario tiene un rol desconocido');
  }
  if (new Set(props.roles).size !== props.roles.length) throw new InvalidUserError('El usuario tiene roles repetidos');
  if (props.zoneId !== null && !isPositiveInt(props.zoneId)) throw new InvalidUserError('La zona del usuario no es válida');
  if (Number.isNaN(props.createdAt.getTime())) throw new InvalidUserError('La fecha de creación del usuario no es válida');
  return Object.freeze({ ...props, roles: Object.freeze([...props.roles]) });
}

export interface CreateUserParams {
  email: string;
  username: string;
  fullName: string;
  password: string;
}

/** Parámetros para actualizar. Todo opcional, salvo password que se re-hashea. */
export type UpdateUserParams = Partial<CreateUserParams>;