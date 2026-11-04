/** Lo que la UI muestra de otra persona. Sin correo ni datos internos de la cuenta. */
export interface FriendUser {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/** Solicitud que otra persona me envió: `id` es el de la solicitud, no el del usuario. */
export interface ReceivedFriendRequest {
  readonly id: number;
  readonly from: FriendUser;
}

/** Solicitud que yo envié y sigue sin respuesta. */
export interface SentFriendRequest {
  readonly id: number;
  readonly to: FriendUser;
}

/** Mis amigos y mis solicitudes pendientes, en ambos sentidos. */
export interface FriendshipOverview {
  readonly friends: readonly FriendUser[];
  readonly pendingReceived: readonly ReceivedFriendRequest[];
  readonly pendingSent: readonly SentFriendRequest[];
}

/** Respuestas posibles a una solicitud recibida (mismos valores que el backend). */
export type FriendRequestAnswer = "ACEPTADA" | "RECHAZADA";

/** Resultado de buscar personas: `total` puede ser mayor que los candidatos que se muestran. */
export interface FriendCandidateSearch {
  readonly candidates: readonly FriendUser[];
  readonly total: number;
}

/** Qué relación tengo con otra persona, según mis amigos y solicitudes pendientes. */
export type FriendRelation = "none" | "friend" | "request-sent" | "request-received";
