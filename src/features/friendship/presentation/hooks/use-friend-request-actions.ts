"use client";

import { useActionState } from "react";
import { initialFriendshipActionState } from "../actions/friendship-action-state";
import { respondFriendRequestAction, sendFriendRequestAction } from "../actions/friendship.actions";

/** Hook fachada para aceptar o rechazar una solicitud: el formulario usa `respond` como action. */
export function useRespondFriendRequest() {
  const [state, respond, pending] = useActionState(
    respondFriendRequestAction,
    initialFriendshipActionState,
  );
  return { error: state.error, respond, pending };
}

/** Hook fachada para enviar una solicitud: el formulario usa `send` como action. */
export function useSendFriendRequest() {
  const [state, send, pending] = useActionState(sendFriendRequestAction, initialFriendshipActionState);
  return { error: state.error, send, pending };
}
