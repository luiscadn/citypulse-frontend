import { assertValidFriendTarget } from "../../domain/rules/friend-target";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/**
 * Caso de Uso: SendFriendRequestUseCase
 *
 * - **¿Qué hace?**: Envía una nueva solicitud de amistad a otro usuario tras validar que el destinatario sea válido
 *   y no sea el propio usuario solicitante (`assertValidFriendTarget`).
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde la Server Action `sendFriendRequestAction`.
 * - **¿Cuál es su importancia?**: Centraliza la emisión de solicitudes de amistad garantizando el cumplimiento
 *   de las invariantes del dominio.
 */
export class SendFriendRequestUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  /**
   * Ejecuta el envío de la solicitud de amistad.
   *
   * @param currentUserId - Identificador del usuario que envía.
   * @param targetUserId - Identificador del usuario receptor.
   */
  async execute(currentUserId: number, targetUserId: number): Promise<void> {
    assertValidFriendTarget(currentUserId, targetUserId);
    await this.friendshipRepository.sendRequest(targetUserId);
  }
}
