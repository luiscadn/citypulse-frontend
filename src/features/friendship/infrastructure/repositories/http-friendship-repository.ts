import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { FriendshipRepository } from "../../application/repositories/friendship-repository";
import type {
  FriendRequestAnswer,
  FriendshipOverview,
  FriendUser,
} from "../../domain/entities/friendship";
import {
  FriendRequestAlreadyAnsweredError,
  FriendRequestAlreadyExistsError,
  FriendRequestForbiddenError,
  FriendRequestNotFoundError,
  FriendTargetNotFoundError,
} from "../../domain/errors/friendship-errors";
import type { FriendshipSummaryDto, FriendUserDto } from "../dtos/friendship.dto";
import { toFriendshipOverview, toFriendUser } from "../mappers/friendship.mapper";

export class HttpFriendshipRepository implements FriendshipRepository {
  constructor(private readonly http: HttpClient) {}

  async getOverview(): Promise<FriendshipOverview> {
    const dto = await this.http.get<FriendshipSummaryDto>("/friendships");
    return toFriendshipOverview(dto);
  }

  async findUser(userId: number): Promise<FriendUser> {
    try {
      const dto = await this.http.get<FriendUserDto>(`/users/${userId}`);
      return toFriendUser(dto);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        throw new FriendTargetNotFoundError();
      }
      throw error;
    }
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
