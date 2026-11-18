/**
 * @file admin-users.actions.ts
 * @description Server Actions para la administración de roles de usuario por parte de Administradores.
 */

"use server";

import { revalidatePath } from "next/cache";
import type { AuthUser } from "@/shared/domain/auth-user";
import { getSessionToken } from "@/shared/infrastructure/session/session-cookie";
import { readValidJwt } from "@/shared/infrastructure/session/jwt";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import type { ActionResult } from "@/shared/presentation/action-result";
import { usersContainer } from "../../di/users.container";
import { parseRoles } from "../../domain/rules/roles";

/**
 * Server Action que reemplaza los roles de un usuario específico (restringido a ADMIN).
 *
 * - **¿Qué hace?**:
 *   Parsea y sanea los roles entrantes (`parseRoles`), verifica la sesión del administrador desde el JWT,
 *   obtiene la identidad del solicitante y ejecuta `assignRoles` en el contenedor, finalizando con la revalidación
 *   de `/admin/users`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada desde el Client Component `UserRoleEditor` en el panel de administración.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que la modificación de privilegios esté rigurosamente autenticada y autorizada en el servidor,
 *   retornando una estructura `ActionResult` tipada para feedback en tiempo real sin recargar la página.
 */
export async function assignRolesAction(userId: number, roles: string[]): Promise<ActionResult> {
  const parsed = parseRoles(roles);
  if (!parsed || !Number.isInteger(userId)) {
    return { ok: false, error: "Selecciona al menos un rol válido." };
  }

  const session = readValidJwt(await getSessionToken());
  if (!session) return { ok: false, error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  try {
    const me = await usersContainer.getUser(session.sub);
    const requester: AuthUser = { id: me.id, email: me.email, username: me.username, roles: me.roles };
    await usersContainer.assignRoles(userId, parsed, requester);
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }

  revalidatePath("/admin/users");
  return { ok: true, data: undefined };
}
