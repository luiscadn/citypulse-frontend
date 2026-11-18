import type {
  FriendCandidateSearch,
  FriendRequestAnswer,
  FriendshipOverview,
} from "../../domain/entities/friendship";

/**
 * Puerto FriendshipRepository (Arquitectura Hexagonal / Limpia)
 *
 * - **¿Qué hace?**: Declara los contratos de operaciones de red para el módulo de relaciones sociales:
 *   obtener resumen de amistades (`getOverview`), buscar candidatos (`searchUsers`),
 *   enviar solicitud (`sendRequest`) y responder solicitud (`respond`).
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Es consumido por
 *   los cuatro casos de uso de amistades e implementado por `HttpFriendshipRepository`.
 * - **¿Cuál es su importancia?**: Desacopla la lógica de negocio social de la infraestructura HTTP,
 *   posibilitando la realización de pruebas unitarias aisladas (`friendship.use-cases.test.ts`).
 */
export interface FriendshipRepository {
  getOverview(): Promise<FriendshipOverview>;
  searchUsers(text: string): Promise<FriendCandidateSearch>;
  sendRequest(toUserId: number): Promise<void>;
  respond(requestId: number, answer: FriendRequestAnswer): Promise<void>;
}
