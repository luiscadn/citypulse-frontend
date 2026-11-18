/**
 * @file get-current-user.ts
 * @description Utilidad de Infraestructura del servidor para leer el usuario autenticado
 * a partir de la cookie de sesión actual sin invocar al backend.
 */

import "server-only";

import { connection } from "next/server";
import { getSessionToken } from "@/shared/infrastructure/session/session-cookie";
import { readValidJwt } from "@/shared/infrastructure/session/jwt";
import type { SessionUser } from "../../domain/entities/session-user";
import { toRoles } from "../mappers/auth.mapper";

/**
 * Obtiene el usuario autenticado de la sesión actual leyendo el JWT de la cookie.
 *
 * - **¿Qué hace?**:
 *   Lee la cookie de sesión, invoca `connection()` de Next.js para indicar que la operación es dinámica
 *   por petición, valida la firma/expiración del JWT con `readValidJwt`, y retorna un objeto `SessionUser` o `null` si no hay sesión válida.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es la función de conveniencia estándar invocada en Server Components (`AppNav`, `VenueDetail`, `EventDetail`)
 *   y Server Actions para determinar quién está navegando.
 *
 * - **¿Cuál es su importancia?**:
 *   Alta eficiencia: permite autenticar peticiones en milisegundos en el servidor sin realizar llamadas HTTP externas al backend.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  await connection();
  const payload = readValidJwt(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email, roles: toRoles(payload.roles) };
}
