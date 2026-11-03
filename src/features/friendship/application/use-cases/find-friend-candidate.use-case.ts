import type { FriendUser } from "../../domain/entities/friendship";
import { assertValidFriendTarget } from "../../domain/rules/friend-target";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/** Busca por ID a quien se le quiere enviar la solicitud, para confirmar que es la persona correcta. */
export class FindFriendCandidateUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  async execute(currentUserId: number, targetUserId: number): Promise<FriendUser> {
    assertValidFriendTarget(currentUserId, targetUserId);
    return this.friendshipRepository.findUser(targetUserId);
  }
}
