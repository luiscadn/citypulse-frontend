import type { FriendRequestAnswer } from "../../domain/entities/friendship";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/**
 * Caso de Uso: RespondFriendRequestUseCase
 *
 * - **¿Qué hace?**: Acepta o rechaza una solicitud de amistad recibida mediante su identificador y respuesta elegida.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde la Server Action `respondFriendRequestAction`.
 * - **¿Cuál es su importancia?**: Coordina la formalización de nuevos lazos de amistad o su desestimación en el backend.
 */
export class RespondFriendRequestUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  /**
   * Ejecuta la respuesta a la solicitud de amistad.
   *
   * @param requestId - Identificador de la solicitud.
   * @param answer - "ACEPTADA" o "RECHAZADA".
   */
  execute(requestId: number, answer: FriendRequestAnswer): Promise<void> {
    return this.friendshipRepository.respond(requestId, answer);
  }
}
