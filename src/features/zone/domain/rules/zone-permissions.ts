import { RoleName } from "@/shared/domain/enums";

/**
 * Función canManageZones: Regla de autorización para administración de zonas urbanas.
 *
 * - **¿Qué hace?**: Evalúa si el usuario proporcionado posee el rol administrativo `RoleName.ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada en Server Components (`ZoneList`, `ZoneDetail`)
 *   para condicionar la visibilidad de los formularios de creación, edición y botones de eliminación, así como
 *   en las Server Actions (`zone.actions.ts`) como primera línea de defensa antes de ejecutar mutaciones.
 * - **¿Cuál es su importancia?**: Centraliza la política de autorización basada en roles (RBAC) para el módulo de zonas.
 *   Si las políticas de gestión cambian (por ejemplo, permitir a un rol `MODERATOR`), solo se modifica esta función pura.
 */
export function canManageZones(user: { roles: readonly RoleName[] } | null): boolean {
  return user?.roles.includes(RoleName.ADMIN) ?? false;
}
