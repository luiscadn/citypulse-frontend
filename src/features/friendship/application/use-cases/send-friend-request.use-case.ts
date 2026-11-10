import { assertValidFriendTarget } from "../../domain/rules/friend-target";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/** Envía una solicitud de amistad a otro usuario. */
export class SendFriendRequestUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  async execute(currentUserId: number, targetUserId: number): Promise<void> {
    assertValidFriendTarget(currentUserId, targetUserId);
    await this.friendshipRepository.sendRequest(targetUserId);
  }
}
