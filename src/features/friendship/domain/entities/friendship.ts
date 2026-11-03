/** Lo que la UI muestra de otra persona. Sin roles ni datos internos de la cuenta. */
export interface FriendUser {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
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
