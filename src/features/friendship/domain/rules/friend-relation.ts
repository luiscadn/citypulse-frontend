import type { FriendRelation, FriendshipOverview } from "../entities/friendship";

/**
 * Función friendRelation: Regla de dominio para inferir la relación social entre usuarios.
 *
 * - **¿Qué hace?**: Examina el `FriendshipOverview` del usuario activo y determina si el `userId` consultado:
 *   - Es amigo confirmado -> `"friend"`
 *   - Tiene solicitud enviada pendiente -> `"request-sent"`
 *   - Tiene solicitud recibida pendiente -> `"request-received"`
 *   - No tiene relación activa -> `"none"`
 * - **¿Cómo interactúa con el sistema en general?**: Es expuesta por el hook `useFriendship().relationWith`
 *   y consumida por `CandidateAction` en la búsqueda de amigos.
 * - **¿Cuál es su importancia?**: Centraliza la lógica de vinculación social en una función pura y fácilmente testeable,
 *   evitando que los componentes de presentación implementen comparaciones manuales dispersas.
 */
export function friendRelation(userId: number, overview: FriendshipOverview): FriendRelation {
  if (overview.friends.some((friend) => friend.id === userId)) return "friend";
  if (overview.pendingSent.some((request) => request.to.id === userId)) return "request-sent";
  if (overview.pendingReceived.some((request) => request.from.id === userId)) return "request-received";
  return "none";
}
