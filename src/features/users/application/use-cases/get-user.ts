/**
 * @file get-user.ts
 * @description Caso de uso funcional para obtener un usuario específico por su ID.
 */

import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../repositories/user-repository";

/** Tipo de la función del caso de uso. */
export type GetUser = (id: number) => Promise<User>;

/**
 * Fábrica del caso de uso para consultar un usuario por ID.
 *
 * - **¿Qué hace?**: Retorna una función que busca y devuelve el perfil del usuario correspondiente al identificador numérico dado.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Invocado por las Server Actions de perfil y de roles, y por las páginas de usuario.
 * - **¿Cuál es su importancia?**: Permite recuperar de forma tipada la información de una cuenta sin exponer datos sensibles.
 */
export function makeGetUser({ users }: { users: UserRepository }): GetUser {
  return (id) => users.findById(id);
}
