/**
 * Entidad de Dominio FriendUser
 *
 * - **¿Qué hace?**: Modela la información pública esencial de un contacto o usuario en la red de amistades:
 *   identificador numérico (`id`), nombre de usuario (`username`) y nombre completo (`fullName`).
 * - **¿Cómo interactúa con el sistema en general?**: Se compone dentro de `FriendshipOverview`, `ReceivedFriendRequest`,
 *   `SentFriendRequest`, y en los resultados de búsqueda `FriendCandidateSearch`.
 * - **¿Cuál es su importancia?**: Aísla y protege los datos personales sensibles (email, contraseñas, roles)
 *   restringiendo el contrato de presentación exclusivamente a la información requerida para la interacción social.
 */
export interface FriendUser {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/**
 * Entidad ReceivedFriendRequest
 *
 * - **¿Qué hace?**: Modela una solicitud de amistad entrante: `id` numérico de la solicitud y el usuario remitente (`from`).
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en `FriendshipOverview` con botones para aceptar o declinar.
 * - **¿Cuál es su importancia?**: Representa peticiones pendientes recibidas en espera de decisión del usuario.
 */
export interface ReceivedFriendRequest {
  readonly id: number;
  readonly from: FriendUser;
}

/**
 * Entidad SentFriendRequest
 *
 * - **¿Qué hace?**: Modela una solicitud de amistad saliente enviada por el usuario actual a un tercero (`to`) aún no respondida.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en `FriendshipOverview` con una insignia de estado "Pendiente".
 * - **¿Cuál es su importancia?**: Mantiene al usuario informado sobre solicitudes salientes para evitar intentos de reenvío duplicados.
 */
export interface SentFriendRequest {
  readonly id: number;
  readonly to: FriendUser;
}

/**
 * Agregado / Resumen FriendshipOverview
 *
 * - **¿Qué hace?**: Agrupa en una sola estructura inmutable el listado de amigos confirmados (`friends`),
 *   las solicitudes pendientes recibidas (`pendingReceived`) y las solicitudes pendientes enviadas (`pendingSent`).
 * - **¿Cómo interactúa con el sistema en general?**: Es obtenido por `GetFriendshipOverviewUseCase` y compartido
 *   a través de `FriendshipContext` y el hook `useFriendship`.
 * - **¿Cuál es su importancia?**: Ofrece una instantánea completa del grafo social del usuario en una sola consulta de red.
 */
export interface FriendshipOverview {
  readonly friends: readonly FriendUser[];
  readonly pendingReceived: readonly ReceivedFriendRequest[];
  readonly pendingSent: readonly SentFriendRequest[];
}

/** Respuestas posibles a una solicitud de amistad */
export type FriendRequestAnswer = "ACEPTADA" | "RECHAZADA";

/**
 * Resultado de Búsqueda FriendCandidateSearch
 *
 * - **¿Qué hace?**: Agrupa la lista de candidatos (`candidates`) encontrados por nombre o usuario y el conteo total de coincidencias (`total`).
 * - **¿Cómo interactúa con el sistema en general?**: Retornado por `SearchFriendCandidatesUseCase` para renderizar `FriendSearchResults`.
 * - **¿Cuál es su importancia?**: Permite mostrar candidatos y alertar si hay más resultados para motivar búsquedas más específicas.
 */
export interface FriendCandidateSearch {
  readonly candidates: readonly FriendUser[];
  readonly total: number;
}

/**
 * Tipo FriendRelation: Estado de relación entre dos usuarios.
 *
 * - **¿Qué hace?**: Clasifica el vínculo social en 4 estados excluyentes:
 *   `"none"` (sin relación), `"friend"` (amigos), `"request-sent"` (solicitud enviada), `"request-received"` (solicitud recibida).
 * - **¿Cómo interactúa con el sistema en general?**: Calculado por la función pura `friendRelation` y consumido por `CandidateAction`.
 * - **¿Cuál es su importancia?**: Determina dinámicamente qué botón o insignia mostrar al lado de cada usuario en búsquedas y eventos.
 */
export type FriendRelation = "none" | "friend" | "request-sent" | "request-received";
