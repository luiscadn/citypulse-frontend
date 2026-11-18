import { InvalidFriendTargetError, SelfFriendRequestError } from "../errors/friendship-errors";

/**
 * Función assertValidFriendTarget
 *
 * - **¿Qué hace?**: Valida que `targetUserId` sea un identificador numérico entero mayor que cero (`InvalidFriendTargetError`)
 *   y que el usuario no intente enviarse una solicitud a sí mismo (`targetUserId === currentUserId`), arrojando `SelfFriendRequestError`.
 * - **¿Cómo interactúa con el sistema en general?**: Es el guardián invocado por `SendFriendRequestUseCase.execute`.
 * - **¿Cuál es su importancia?**: Falla de inmediato ante operaciones ilógicas o inválidas antes de emitir llamadas de red al backend.
 */
export function assertValidFriendTarget(currentUserId: number, targetUserId: number): void {
  if (!Number.isInteger(targetUserId) || targetUserId <= 0) {
    throw new InvalidFriendTargetError();
  }
  if (targetUserId === currentUserId) {
    throw new SelfFriendRequestError();
  }
}
