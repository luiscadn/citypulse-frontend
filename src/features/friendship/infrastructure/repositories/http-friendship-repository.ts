import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { FriendshipRepository } from "../../application/repositories/friendship-repository";
import type {
  FriendCandidateSearch,
  FriendRequestAnswer,
  FriendshipOverview,
} from "../../domain/entities/friendship";
import {
  FriendRequestAlreadyAnsweredError,
  FriendRequestAlreadyExistsError,
  FriendRequestForbiddenError,
  FriendRequestNotFoundError,
  FriendTargetNotFoundError,
} from "../../domain/errors/friendship-errors";
import type { FriendshipSummaryDto, UserSearchPageDto } from "../dtos/friendship.dto";
import { toFriendCandidateSearch, toFriendshipOverview } from "../mappers/friendship.mapper";

/** Una búsqueda muestra pocos resultados: si hay más, se le pide a la persona que la precise. */
const SEARCH_LIMIT = 10;

export class HttpFriendshipRepository implements FriendshipRepository {
  constructor(private readonly http: HttpClient) {}

  async getOverview(): Promise<FriendshipOverview> {
    const dto = await this.http.get<FriendshipSummaryDto>("/friendships");
    return toFriendshipOverview(dto);
  }

  async searchUsers(text: string): Promise<FriendCandidateSearch> {
    const params = new URLSearchParams({ q: text, limit: String(SEARCH_LIMIT) });
    const dto = await this.http.get<UserSearchPageDto>(`/users/search?${params}`);
    return toFriendCandidateSearch(dto);
  }

  async sendRequest(toUserId: number): Promise<void> {
    try {
      await this.http.post("/friendships", { toUserId });
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 404) throw new FriendTargetNotFoundError();
        if (error.status === 409) throw new FriendRequestAlreadyExistsError();
      }
      throw error;
    }
  }

  async respond(requestId: number, answer: FriendRequestAnswer): Promise<void> {
    try {
      await this.http.patch(`/friendships/${requestId}`, { status: answer });
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 400) throw new FriendRequestAlreadyAnsweredError();
        if (error.status === 403) throw new FriendRequestForbiddenError();
        if (error.status === 404) throw new FriendRequestNotFoundError();
      }
      throw error;
    }
  }
}
