import type { FriendshipOverview } from "../../domain/entities/friendship";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/**
 * Caso de Uso: GetFriendshipOverviewUseCase
 *
 * - **¿Qué hace?**: Recupera el resumen completo de amistades del usuario activo (amigos y solicitudes en ambos sentidos)
 *   delegando la consulta al repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Es invocado en `FriendsPage` para inicializar `FriendshipProvider`.
 * - **¿Cuál es su importancia?**: Centraliza la recuperación del estado de la red de amigos del usuario.
 */
export class GetFriendshipOverviewUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  /**
   * Ejecuta la consulta del resumen de amistades.
   *
   * @returns La entidad compuesta `FriendshipOverview`.
   */
  execute(): Promise<FriendshipOverview> {
    return this.friendshipRepository.getOverview();
  }
}
