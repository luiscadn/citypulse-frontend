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
 * Reemplaza los roles de un usuario (solo ADMIN). Los argumentos vienen del navegador,
 * así que se validan aquí; quien pide el cambio sale del JWT de la sesión, no de un argumento.
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