/**
 * Estado FriendshipActionState
 *
 * - **¿Qué hace?**: Modela el estado de retorno de las Server Actions de amistades, conteniendo un mensaje de error opcional (`error`).
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza con `useActionState` en `useRespondFriendRequest` y `useSendFriendRequest`.
 * - **¿Cuál es su importancia?**: Proporciona retroalimentación de fallos de forma reactiva sin interrumpir la experiencia de usuario.
 */
export interface FriendshipActionState {
  error?: string;
}

/** Estado inicial limpio para acciones de amistad */
export const initialFriendshipActionState: FriendshipActionState = {};
