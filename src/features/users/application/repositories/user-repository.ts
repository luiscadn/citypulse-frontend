/**
 * @file user-repository.ts
 * @description Puerto secundario (interfaz) para el repositorio de Usuarios.
 * En Arquitectura Hexagonal / Clean Architecture, define las operaciones de persistencia y consulta
 * que la aplicación necesita para gestionar cuentas de usuario y administración de roles.
 */

import type { User, CreateUserParams, UpdateUserParams } from "../../domain/entities/user";
import type { RoleName } from "@/shared/domain/enums";

/**
 * Contrato de repositorio para el manejo de Usuarios y asignación de Roles.
 *
 * - **¿Qué hace?**:
 *   Declara los métodos para obtener todos los usuarios (`findAll`), buscar por ID (`findById`),
 *   crear usuarios (`create`), actualizar perfiles (`update`), eliminar cuentas (`delete`)
 *   y actualizar la lista de roles asignados (`assignRoles`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Implementado por `HttpUserRepository` en la capa de Infraestructura y consumido por los casos
 *   de uso de la capa de Aplicación (`ListUsers`, `GetUser`, `UpdateUser`, `AssignRoles`).
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el Principio de Inversión de Dependencias (DIP) de SOLID. Desacopla las reglas de negocio
 *   de las llamadas de red HTTP o de los esquemas de persistencia remotos.
 */
export interface UserRepository {
  /** Obtiene todos los usuarios registrados en el sistema. */
  findAll(): Promise<User[]>;

  /** Obtiene un usuario específico a partir de su ID numérico. */
  findById(id: number): Promise<User>;

  /** Crea un nuevo usuario en el sistema. */
  create(params: CreateUserParams): Promise<User>;

  /** Actualiza los campos editables del perfil de un usuario. */
  update(id: number, params: UpdateUserParams): Promise<User>;

  /** Elimina un usuario del sistema. */
  delete(id: number): Promise<void>;

  /** Reemplaza los roles asociados al usuario indicado. */
  assignRoles(id: number, roles: readonly RoleName[]): Promise<User>;
}
