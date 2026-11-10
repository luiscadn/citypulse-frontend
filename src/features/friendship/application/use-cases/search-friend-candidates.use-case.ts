import type { FriendCandidateSearch } from "../../domain/entities/friendship";
import { FriendSearchTooShortError } from "../../domain/errors/friendship-errors";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/** Busca personas por usuario o nombre para enviarles una solicitud. */
export class SearchFriendCandidatesUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  async execute(text: string): Promise<FriendCandidateSearch> {
    const trimmed = text.trim();
    if (trimmed.length < 2) {
      throw new FriendSearchTooShortError();
    }
    return this.friendshipRepository.searchUsers(trimmed);
  }
}
