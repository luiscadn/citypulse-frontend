import type {
  FriendCandidateSearch,
  FriendRequestAnswer,
  FriendshipOverview,
} from "../../domain/entities/friendship";

/** Puerto: lo que la aplicación necesita del backend para manejar amistades. */
export interface FriendshipRepository {
  getOverview(): Promise<FriendshipOverview>;
  searchUsers(text: string): Promise<FriendCandidateSearch>;
  sendRequest(toUserId: number): Promise<void>;
  respond(requestId: number, answer: FriendRequestAnswer): Promise<void>;
}
