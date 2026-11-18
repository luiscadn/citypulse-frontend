"use client";

import { useActionState } from "react";
import { initialFriendshipActionState } from "../actions/friendship-action-state";
import { respondFriendRequestAction, sendFriendRequestAction } from "../actions/friendship.actions";

/**
 * Hook useRespondFriendRequest: Fachada de acción para aceptar o rechazar solicitudes de amistad.
 *
 * - **¿Qué hace?**: Vincula `respondFriendRequestAction` con `useActionState`, entregando `error`, la función `respond` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `FriendRequestActions`.
 * - **¿Cuál es su importancia?**: Simplifica la lógica de formulario para responder solicitudes recibidas.
 */
export function useRespondFriendRequest() {
  const [state, respond, pending] = useActionState(
    respondFriendRequestAction,
    initialFriendshipActionState,
  );
  return { error: state.error, respond, pending };
}

/**
 * Hook useSendFriendRequest: Fachada de acción para enviar solicitudes de amistad.
 *
 * - **¿Qué hace?**: Vincula `sendFriendRequestAction` con `useActionState`, entregando `error`, la función `send` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `SendFriendRequestButton`.
 * - **¿Cuál es su importancia?**: Proporciona estado reactivo durante el envío de solicitudes de amistad a nuevos usuarios.
 */
export function useSendFriendRequest() {
  const [state, send, pending] = useActionState(sendFriendRequestAction, initialFriendshipActionState);
  return { error: state.error, send, pending };
}
