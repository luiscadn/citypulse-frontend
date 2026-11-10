import { InvalidFriendTargetError, SelfFriendRequestError } from "../errors/friendship-errors";

/**
 * Réplica UX de las validaciones del backend: evita una petición que ya se sabe
 * que va a fallar. Si difieren, el backend gana.
 */
export function assertValidFriendTarget(currentUserId: number, targetUserId: number): void {
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    throw new InvalidFriendTargetError();
  }
  if (targetUserId === currentUserId) {
    throw new SelfFriendRequestError();
  }
}
