/**
 * @file update-user.ts
 * @description Caso de uso funcional para actualizar los datos del perfil de un usuario.
 */

import type { AuthUser } from "@/shared/domain/auth-user";
import { canEditUser } from "../../domain/rules/permissions";
import { ForbiddenActionError } from "../../domain/errors/user-errors";
import type { User, UpdateUserParams } from "../../domain/entities/user";
import type { UserRepository } from "../repositories/user-repository";

/** Tipo de la función del caso de uso. */
export type UpdateUser = (
  id: number,
  params: UpdateUserParams,
  requester: AuthUser,
) => Promise<User>;

interface Deps {
  users: UserRepository;
}

/**
 * Fábrica del caso de uso para modificar datos de un usuario.
 *
 * - **¿Qué hace?**:
 *   Evalúa si el usuario solicitante tiene permiso para editar la cuenta (`canEditUser`),
 *   lanzando `ForbiddenActionError` si la autorización es denegada; de lo contrario, delega la actualización a `users.update`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Invocado por `updateProfileAction` en la pantalla `/profile`.
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica control de acceso defensivo antes de recurrir a la red, resguardando la información personal.
 */
export function makeUpdateUser({ users }: Deps): UpdateUser {
  return async (id, params, requester) => {
    if (!canEditUser(requester, id)) {
      throw new ForbiddenActionError();
    }
    return users.update(id, params);
  };
}
