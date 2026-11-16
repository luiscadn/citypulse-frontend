import type { RoleName } from "@/shared/domain/enums";
import type { SessionUser } from "../entities/session-user";

/** Sin sesión no se tiene ningún rol. */
export function hasRole(user: SessionUser | null, role: RoleName): boolean {
  return user?.roles.includes(role) ?? false;
}
