/**
 * @file user.ts
 * @description Entidades de Dominio y tipos de datos para la gestión de Usuarios y Roles.
 * Representa la proyección limpia y segura de los perfiles de usuario consumidos por la interfaz,
 * separándola deliberadamente del modelo interno de persistencia de la base de datos (TypeORM).
 */

import type { RoleName } from "@/shared/domain/enums";

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
