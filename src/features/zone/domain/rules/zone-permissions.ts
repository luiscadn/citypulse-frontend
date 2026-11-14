import { RoleName } from "@/shared/domain/enums";

/**
 * Réplica UX de ZoneController: leer zonas es público, crearlas, editarlas y
 * borrarlas es solo de ADMIN. Sirve para mostrar u ocultar los formularios.
 */
export function canManageZones(user: { roles: readonly RoleName[] } | null): boolean {
  return user?.roles.includes(RoleName.ADMIN) ?? false;
}
