import type { FriendRequestAnswer } from "../../domain/entities/friendship";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/** Acepta o rechaza una solicitud recibida. */
export class RespondFriendRequestUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  execute(requestId: number, answer: FriendRequestAnswer): Promise<void> {
    return this.friendshipRepository.respond(requestId, answer);
  }
}
