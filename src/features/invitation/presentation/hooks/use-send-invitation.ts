"use client";

import { useActionState } from "react";
import { initialInvitationActionState } from "../actions/invitation-action-state";
import { sendInvitationAction } from "../actions/invitation.actions";

/**
 * Hook fachada para enviar invitaciones a amigos a un evento.
 *
 * - **¿Qué hace?**: Enlaza la Server Action `sendInvitationAction` con `useActionState`, exponiendo
 *   `error`, `success`, la función de despacho `send` y el indicador de carga `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el formulario de invitar amigos `InviteFriendsForm`.
 * - **¿Cuál es su importancia?**: Simplifica el envío de invitaciones individuales manteniendo el estado reactivo sin recargar la página.
 */
export function useSendInvitation() {
  const [state, send, pending] = useActionState(sendInvitationAction, initialInvitationActionState);
  return { error: state.error, success: state.success, send, pending };
}
