import type { FriendshipOverview, FriendUser } from "../../domain/entities/friendship";
import type { FriendshipSummaryDto, FriendUserDto } from "../dtos/friendship.dto";

/** Solo copia los campos de FriendUser: lo demás que mande el backend no llega a la UI. */
export function toFriendUser(dto: FriendUserDto): FriendUser {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.fullName,
    email: dto.email,
  };
}

export function toFriendshipOverview(dto: FriendshipSummaryDto): FriendshipOverview {
  return {
    friends: dto.friends.map(toFriendUser),
    pendingReceived: dto.pendingReceived.map((r) => ({ id: r.id, from: toFriendUser(r.from) })),
    pendingSent: dto.pendingSent.map((r) => ({ id: r.id, to: toFriendUser(r.to) })),
  };
}
