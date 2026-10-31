// src/features/users/domain/rules/permissions.ts
import type { AuthUser } from '@/shared/domain/auth-user';
import { RoleName } from '@/shared/domain/enums';

/** Réplica UX (no autoritativa) de las reglas del backend.
 *  El backend valida por seguridad; el frontend valida para OCULTAR/MOSTRAR
 *  botones. Si difieren, el backend gana: el frontend no es la última línea. */

export function canEditUser(requester: AuthUser, targetUserId: number): boolean {
  return requester.id === targetUserId || requester.roles.includes(RoleName.ADMIN);
}

export function canDeleteUser(requester: AuthUser): boolean {
  return requester.roles.includes(RoleName.ADMIN);
}

export function canAssignRoles(requester: AuthUser): boolean {
  return requester.roles.includes(RoleName.ADMIN);
}

/** Regla "no puedes quitarte tu propio rol ADMIN".
 *  Espejo de la validación de UsersService.assignRoles. */
export function wouldSelfDemote(
  requester: AuthUser,
  targetUserId: number,
  newRoles: readonly RoleName[],
): boolean {
  return requester.id === targetUserId && !newRoles.includes(RoleName.ADMIN);
}