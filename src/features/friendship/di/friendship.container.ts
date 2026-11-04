import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { GetFriendshipOverviewUseCase } from "../application/use-cases/get-friendship-overview.use-case";
import { RespondFriendRequestUseCase } from "../application/use-cases/respond-friend-request.use-case";
import { SearchFriendCandidatesUseCase } from "../application/use-cases/search-friend-candidates.use-case";
import { SendFriendRequestUseCase } from "../application/use-cases/send-friend-request.use-case";
import { HttpFriendshipRepository } from "../infrastructure/repositories/http-friendship-repository";

/** Arma los casos de uso de amistades con sus implementaciones concretas. */
const friendshipRepository = new HttpFriendshipRepository(serverHttp);

export const friendshipContainer = {
  getFriendshipOverviewUseCase: new GetFriendshipOverviewUseCase(friendshipRepository),
  searchFriendCandidatesUseCase: new SearchFriendCandidatesUseCase(friendshipRepository),
  sendFriendRequestUseCase: new SendFriendRequestUseCase(friendshipRepository),
  respondFriendRequestUseCase: new RespondFriendRequestUseCase(friendshipRepository),
};
