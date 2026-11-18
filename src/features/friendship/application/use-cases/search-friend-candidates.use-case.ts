import type { FriendCandidateSearch } from "../../domain/entities/friendship";
import { FriendSearchTooShortError } from "../../domain/errors/friendship-errors";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/**
 * Caso de Uso: SearchFriendCandidatesUseCase
 *
 * - **¿Qué hace?**: Busca usuarios registrados en el sistema por nombre o username.
 *   Limpia el texto con `trim()` y valida que contenga al menos 2 caracteres; de lo contrario arroja `FriendSearchTooShortError`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde `FriendSearchResults` en la página `/friends`.
 * - **¿Cuál es su importancia?**: Fomenta el descubrimiento de personas y expansión de la red de contactos,
 *   evitando búsquedas vacías o demasiado amplias.
 */
export class SearchFriendCandidatesUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  /**
   * Ejecuta la búsqueda de candidatos.
   *
   * @param text - Término de búsqueda escrito por el usuario.
   * @returns Lista de candidatos y conteo total de coincidencias.
   */
  async execute(text: string): Promise<FriendCandidateSearch> {
    const trimmed = text.trim();
    if (trimmed.length < 2) {
      throw new FriendSearchTooShortError();
    }
    return this.friendshipRepository.searchUsers(trimmed);
  }
}
