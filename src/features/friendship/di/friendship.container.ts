import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { GetFriendshipOverviewUseCase } from "../application/use-cases/get-friendship-overview.use-case";
import { RespondFriendRequestUseCase } from "../application/use-cases/respond-friend-request.use-case";
import { SearchFriendCandidatesUseCase } from "../application/use-cases/search-friend-candidates.use-case";
import { SendFriendRequestUseCase } from "../application/use-cases/send-friend-request.use-case";
import { HttpFriendshipRepository } from "../infrastructure/repositories/http-friendship-repository";

/**
 * Contenedor de Inyección de Dependencias friendshipContainer (Capa de Composición / DI)
 *
 * - **¿Qué hace?**: Instancia `HttpFriendshipRepository` con `serverHttp` y ensambla los cuatro casos de uso
 *   del módulo (`getFriendshipOverviewUseCase`, `searchFriendCandidatesUseCase`, `sendFriendRequestUseCase`, `respondFriendRequestUseCase`).
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta exclusivamente en el servidor (`server-only`).
 *   Es consumido por la página `/friends` y las Server Actions de amistades.
 * - **¿Cuál es su importancia?**: Centraliza la configuración de dependencias del módulo social en un único singleton.
 */
const friendshipRepository = new HttpFriendshipRepository(serverHttp);

export const friendshipContainer = {
  getFriendshipOverviewUseCase: new GetFriendshipOverviewUseCase(friendshipRepository),
  searchFriendCandidatesUseCase: new SearchFriendCandidatesUseCase(friendshipRepository),
  sendFriendRequestUseCase: new SendFriendRequestUseCase(friendshipRepository),
  respondFriendRequestUseCase: new RespondFriendRequestUseCase(friendshipRepository),
};
