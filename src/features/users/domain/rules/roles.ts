import { RoleName } from "@/shared/domain/enums";

/** Todos los roles, en el orden en que se muestran. */
export const ALL_ROLES: readonly RoleName[] = [RoleName.USER, RoleName.OWNER, RoleName.ADMIN];

/**
 * Convierte lo que llega de fuera (los argumentos de una Server Action vienen del
 * navegador y no son de fiar) en una lista de roles válida, sin repetidos.
 * Devuelve null si está vacía o trae algo que no es un rol; el backend exige al menos uno.
 */
export function parseRoles(raw: unknown): RoleName[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const valid = new Set<string>(ALL_ROLES);
  if (!raw.every((role) => typeof role === "string" && valid.has(role))) return null;
  return ALL_ROLES.filter((role) => raw.includes(role));
}
