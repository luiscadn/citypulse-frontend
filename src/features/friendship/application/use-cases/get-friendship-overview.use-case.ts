import type { FriendshipOverview } from "../../domain/entities/friendship";
import type { FriendshipRepository } from "../repositories/friendship-repository";

/** Trae mis amigos y mis solicitudes pendientes. */
export class GetFriendshipOverviewUseCase {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  execute(): Promise<FriendshipOverview> {
    return this.friendshipRepository.getOverview();
  }
}
