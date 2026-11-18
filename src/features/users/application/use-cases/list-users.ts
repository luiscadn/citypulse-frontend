/**
 * @file list-users.ts
 * @description Caso de uso funcional para listar todos los usuarios del sistema.
 */

import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../repositories/user-repository";

/** Tipo de la función del caso de uso. */
export type ListUsers = () => Promise<User[]>;

/** Dependencias requeridas por el caso de uso. */
interface Deps {
  users: UserRepository;
}

/**
 * Fábrica del caso de uso para listar usuarios.
 *
 * - **¿Qué hace?**: Retorna una función que consulta y devuelve la colección de todos los usuarios registrados en el sistema.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Se invoca en el Server Component `UserRolesAdmin` y se registra en `usersContainer`.
 * - **¿Cuál es su importancia?**: Proporciona el punto de acceso para la administración global de cuentas de usuario.
 */
export function makeListUsers({ users }: Deps): ListUsers {
  return () => users.findAll();
}
