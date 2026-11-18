/**
 * @file roles.ts
 * @description Reglas de Dominio y saneamiento para la lista de Roles del sistema.
 * Asegura el orden canónico y la validación defensiva de los roles permitidos.
 */

import { RoleName } from "@/shared/domain/enums";

/**
 * Arreglo inmutable que define todos los roles del sistema en su orden canónico de presentación.
 *
 * - **¿Qué hace?**: Enumera secuencialmente los roles: `USER`, `OWNER`, `ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado para mapeos, selectores de UI (`UserRoleEditor`) y validación de membresía.
 * - **¿Cuál es su importancia?**: Centraliza la lista exhaustiva de roles del sistema evitando discrepancias entre vistas.
 */
export const ALL_ROLES: readonly RoleName[] = [RoleName.USER, RoleName.OWNER, RoleName.ADMIN];

/**
 * Parsea y sanea una entrada desconocida asegurando que sea un arreglo válido de roles sin duplicados.
 *
 * - **¿Qué hace?**:
 *   Evalúa que el argumento recibido sea un array no vacío de strings donde cada elemento pertenezca
 *   a `ALL_ROLES`. Retorna los roles filtrados y ordenados canónicamente, o `null` si hay datos no válidos.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocado en la Server Action `assignRolesAction` para depurar los datos recibidos del cliente web antes de pasarlos a la capa de aplicación.
 *
 * - **¿Cuál es su importancia?**:
 *   Barrera de seguridad defensiva: previene inyección de roles inexistentes o listas vacías que violen las restricciones de base de datos del backend.
 */
export function parseRoles(raw: unknown): RoleName[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const valid = new Set<string>(ALL_ROLES);
  if (!raw.every((role) => typeof role === "string" && valid.has(role))) return null;
  return ALL_ROLES.filter((role) => raw.includes(role));
}
