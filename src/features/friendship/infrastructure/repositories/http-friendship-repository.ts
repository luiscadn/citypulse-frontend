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

/** Límite de resultados retornados en la búsqueda de personas */
const SEARCH_LIMIT = 10;

/**
 * Adaptador HttpFriendshipRepository (Infraestructura en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Implementa el puerto `FriendshipRepository` ejecutando peticiones HTTP hacia `/friendships`
 *   y `/users/search` con `HttpClient`. Mapea los códigos de estado HTTP (400, 403, 404, 409) a excepciones
 *   tipadas del dominio (`FriendTargetNotFoundError`, `FriendRequestAlreadyExistsError`, etc.).
 * - **¿Cómo interactúa con el sistema en general?**: Es instanciado en `friendship.container.ts` con `serverHttp`.
 * - **¿Cuál es su importancia?**: Centraliza las operaciones de red de la red social de usuarios en una sola clase mantenible.
 */
export class HttpFriendshipRepository implements FriendshipRepository {
  constructor(private readonly http: HttpClient) {}

  /** Consulta el resumen de amistades mediante `GET /friendships`. */
  async getOverview(): Promise<FriendshipOverview> {
    const dto = await this.http.get<FriendshipSummaryDto>("/friendships");
    return toFriendshipOverview(dto);
  }

  /** Busca usuarios por coincidencia de texto mediante `GET /users/search?q=...&limit=10`. */
  async searchUsers(text: string): Promise<FriendCandidateSearch> {
    const params = new URLSearchParams({ q: text, limit: String(SEARCH_LIMIT) });
    const dto = await this.http.get<UserSearchPageDto>(`/users/search?${params}`);
    return toFriendCandidateSearch(dto);
  }

  /** Envía una nueva solicitud de amistad mediante `POST /friendships`. Mapea 404 y 409. */
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

  /** Responde una solicitud de amistad mediante `PATCH /friendships/:id`. Mapea 400, 403 y 404. */
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
