import "server-only";

import { connection } from "next/server";
import { getSessionToken } from "@/shared/infrastructure/session/session-cookie";
import { readValidJwt } from "@/shared/infrastructure/session/jwt";
import type { SessionUser } from "../../domain/entities/session-user";
import { toRoles } from "../mappers/auth.mapper";

/**
 * Usuario de la sesión actual, leído del JWT de la cookie (sin llamar al backend).
 * Devuelve null si no hay sesión o el token expiró.
 *
 * Lee cookies(), así que con Cache Components quien lo use debe estar
 * dentro de un <Suspense>.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  // La expiración se compara con la hora actual (Date.now): con Cache Components
  // hay que avisar que este cálculo es por petición y no se puede prerenderizar.
  await connection();
  const payload = readValidJwt(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, roles: toRoles(payload.roles) };
}
