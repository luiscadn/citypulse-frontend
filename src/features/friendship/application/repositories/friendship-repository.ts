import type {
  FriendRequestAnswer,
  FriendshipOverview,
  FriendUser,
} from "../../domain/entities/friendship";

/** Puerto: lo que la aplicación necesita del backend para manejar amistades. */
export interface FriendshipRepository {
  getOverview(): Promise<FriendshipOverview>;
  findUser(userId: number): Promise<FriendUser>;
  sendRequest(toUserId: number): Promise<void>;
  respond(requestId: number, answer: FriendRequestAnswer): Promise<void>;
}
