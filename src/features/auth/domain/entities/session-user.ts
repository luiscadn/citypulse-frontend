import type { RoleName } from "@/shared/domain/enums";

/**
 * Usuario autenticado según el JWT de la sesión (sub, email, roles).
 * El token no trae username: si se necesita el perfil completo
 * (AuthUser de shared/domain), hay que pedirlo a GET /auth/profile.
 */
export interface SessionUser {
  id: number;
  email: string;
  roles: RoleName[];
}
