import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { FindFriendCandidateUseCase } from "../application/use-cases/find-friend-candidate.use-case";
import { GetFriendshipOverviewUseCase } from "../application/use-cases/get-friendship-overview.use-case";
import { RespondFriendRequestUseCase } from "../application/use-cases/respond-friend-request.use-case";
import { SendFriendRequestUseCase } from "../application/use-cases/send-friend-request.use-case";
import { HttpFriendshipRepository } from "../infrastructure/repositories/http-friendship-repository";

/** Arma los casos de uso de amistades con sus implementaciones concretas. */
const friendshipRepository = new HttpFriendshipRepository(serverHttp);

export const friendshipContainer = {
  getFriendshipOverviewUseCase: new GetFriendshipOverviewUseCase(friendshipRepository),
  findFriendCandidateUseCase: new FindFriendCandidateUseCase(friendshipRepository),
  sendFriendRequestUseCase: new SendFriendRequestUseCase(friendshipRepository),
  respondFriendRequestUseCase: new RespondFriendRequestUseCase(friendshipRepository),
};
