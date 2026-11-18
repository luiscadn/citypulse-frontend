/**
 * DTO FriendUserDto (Data Transfer Object)
 *
 * - **¿Qué hace?**: Modela los datos de usuario devueltos por los endpoints de amistades (`id`, `username`, `fullName`).
 * - **¿Cómo interactúa con el sistema en general?**: Deserializado en las respuestas de `/friendships` y `/users/search`.
 * - **¿Cuál es su importancia?**: Aísla el modelo de dominio de atributos internos de la base de datos de usuarios.
 */
export interface FriendUserDto {
  id: number;
  username: string;
  fullName: string;
}

/**
 * DTO FriendshipSummaryDto
 *
 * - **¿Qué hace?**: Modela la respuesta completa del endpoint `GET /friendships` conteniendo amigos confirmados
 *   y solicitudes pendientes recibidas y enviadas.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado en `HttpFriendshipRepository.getOverview`.
 * - **¿Cuál es su importancia?**: Captura la estructura del JSON del backend y permite transformarla a `FriendshipOverview`.
 */
export interface FriendshipSummaryDto {
  friends: FriendUserDto[];
  pendingReceived: { id: number; from: FriendUserDto }[];
  pendingSent: { id: number; to: FriendUserDto }[];
}

/**
 * DTO UserSearchPageDto
 *
 * - **¿Qué hace?**: Modela la respuesta paginada devuelta por `GET /users/search` con arreglo de datos y total de registros.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado en `HttpFriendshipRepository.searchUsers`.
 * - **¿Cuál es su importancia?**: Proporciona tipado seguro al resultado de la búsqueda de usuarios.
 */
export interface UserSearchPageDto {
  data: FriendUserDto[];
  total: number;
}
