/**
 * @file session-roles.ts
 * @description Reglas de Dominio para evaluar permisos y roles del usuario en sesión.
 */

import type { RoleName } from "@/shared/domain/enums";
import type { SessionUser } from "../entities/session-user";

/**
 * Comprueba si el usuario autenticado posee un rol determinado.
 *
 * - **¿Qué hace?**: Verifica si el array `roles` del usuario incluye el `role` consultado; devuelve `false` si no hay sesión.
 * - **¿Cómo interactúa con el sistema en general?**: Usada internamente por el hook `useSession()` y por funciones de guardia.
 * - **¿Cuál es su importancia?**: Centraliza la verificación de membresía de rol evitando accesos nulos inseguros (`user?.roles`).
 */
export function hasRole(user: SessionUser | null, role: RoleName): boolean {
  return user?.roles.includes(role) ?? false;
}
