import type {
  FriendCandidateSearch,
  FriendshipOverview,
  FriendUser,
} from "../../domain/entities/friendship";
import type { FriendshipSummaryDto, FriendUserDto, UserSearchPageDto } from "../dtos/friendship.dto";

/** Transforma `FriendUserDto` en la entidad inmutable `FriendUser`. */
export function toFriendUser(dto: FriendUserDto): FriendUser {
  return {
    id: dto.id,
    username: dto.username,
    fullName: dto.fullName,
  };
}

/** Transforma `FriendshipSummaryDto` en la entidad compuesta `FriendshipOverview`. */
export function toFriendshipOverview(dto: FriendshipSummaryDto): FriendshipOverview {
  return {
    friends: dto.friends.map(toFriendUser),
    pendingReceived: dto.pendingReceived.map((r) => ({ id: r.id, from: toFriendUser(r.from) })),
    pendingSent: dto.pendingSent.map((r) => ({ id: r.id, to: toFriendUser(r.to) })),
  };
}

/** Transforma `UserSearchPageDto` en el resultado de dominio `FriendCandidateSearch`. */
export function toFriendCandidateSearch(dto: UserSearchPageDto): FriendCandidateSearch {
  return { candidates: dto.data.map(toFriendUser), total: dto.total };
}
