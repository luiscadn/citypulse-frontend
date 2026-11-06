import type { FriendRelation, FriendshipOverview } from "../entities/friendship";

/**
 * Relación con otra persona según mi resumen de amistades. Una solicitud rechazada
 * no aparece en el resumen: da "none" y el backend responde 409 si se intenta repetir.
 */
export function friendRelation(userId: number, overview: FriendshipOverview): FriendRelation {
  if (overview.friends.some((friend) => friend.id === userId)) return "friend";
  if (overview.pendingSent.some((request) => request.to.id === userId)) return "request-sent";
  if (overview.pendingReceived.some((request) => request.from.id === userId)) return "request-received";
  return "none";
}
