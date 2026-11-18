/**
 * @file assign-roles.ts
 * @description Caso de uso funcional para la asignación y modificación administrativa de Roles de Usuario.
 */

import type { AuthUser } from "@/shared/domain/auth-user";
import type { RoleName } from "@/shared/domain/enums";
import { canAssignRoles, wouldSelfDemote } from "../../domain/rules/permissions";
import { ForbiddenActionError, SelfDemotionError } from "../../domain/errors/user-errors";
import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../repositories/user-repository";

/** Tipo de la función del caso de uso. */
export type AssignRoles = (
  id: number,
  roles: readonly RoleName[],
  requester: AuthUser,
) => Promise<User>;

/**
 * Fábrica del caso de uso para asignar roles a un usuario.
 *
 * - **¿Qué hace?**:
 *   Verifica que el solicitante tenga permisos para asignar roles (`canAssignRoles`), comprueba que no
 *   se esté auto-revocando el rol ADMIN (`wouldSelfDemote`), y solicita al repositorio actualizar los roles.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Invocado por la Server Action `assignRolesAction` en el panel `/admin/users`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza el cumplimiento estricto del modelo RBAC (Role-Based Access Control) y previene bloqueos
 *   accidentales de administración en la plataforma.
 */
export function makeAssignRoles({ users }: { users: UserRepository }): AssignRoles {
  return async (id, roles, requester) => {
    if (!canAssignRoles(requester)) throw new ForbiddenActionError();
    if (wouldSelfDemote(requester, id, roles)) throw new SelfDemotionError();
    return users.assignRoles(id, roles);
  };
}
