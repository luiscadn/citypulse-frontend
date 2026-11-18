// src/features/users/domain/entities/user.ts
import { RoleName } from '@/shared/domain/enums';
import { isNonBlank, isOneOf, isPositiveInt } from '@/shared/domain/invariants';
import { InvalidUserError } from '../errors/user-errors';

/**
 * Entidad principal de Dominio que modela a un Usuario del sistema.
 *
 * - **¿Qué hace?**:
 *   Define los atributos públicos e inmutables del perfil de usuario: identificador numérico,
 *   correo electrónico, nombre de usuario (`username`), nombre completo (`fullName`), lista de roles asignados,
 *   estado de activación de la cuenta (`isActive`), estado del segundo factor de autenticación (`twoFactorEnabled`),
 *   zona geográfica predeterminada (`zoneId`) y fecha de creación como objeto `Date`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es la entidad central del submódulo de usuarios en la capa de Dominio. Mapeada desde `UserDto` en Infraestructura,
 *   retornada por los casos de uso (`GetUser`, `ListUsers`, `UpdateUser`, `AssignRoles`) y presentada en
 *   componentes visuales (`UserRolesAdmin`, `ProfileForm`).
 *
 * - **¿Cuál es su importancia?**:
 *   Principio de mínima exposición y seguridad: no contiene hashes de contraseñas (`passwordHash`),
 *   secretos TOTP de doble factor (`twoFactorSecret`) ni banderas de borrado lógico (`deletedAt`),
 *   blindando al cliente contra filtraciones accidentales de credenciales o secretos criptográficos.
 */
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

/**
 * Parámetros requeridos para la creación de un nuevo usuario en el sistema.
 *
 * - **¿Qué hace?**:
 *   Estructura las propiedades mínimas para dar de alta una cuenta: email, username, fullName y password en texto plano.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado como contrato de entrada en el puerto `UserRepository.create`.
 *
 * - **¿Cuál es su importancia?**:
 *   Diferencia el payload de entrada respecto a la entidad completa, omitiendo metadatos que el backend autogenera.
 */
export interface CreateUserParams {
  email: string;
  username: string;
  fullName: string;
  password: string;
}

/**
 * Parámetros parciales para la actualización del perfil de un usuario existente.
 *
 * - **¿Qué hace?**:
 *   Permite enviar selectivamente cualquier subconjunto de campos editables de la cuenta.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el parámetro recibido por `UpdateUser` y `UserRepository.update`.
 *
 * - **¿Cuál es su importancia?**:
 *   Soporta actualizaciones parciales (PATCH semántico), permitiendo modificar solo el nombre o username sin requerir reingresar la contraseña.
 */
export type UpdateUserParams = Partial<CreateUserParams>;