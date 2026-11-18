"use client";

import { useActionState } from "react";
import { initialInvitationActionState } from "../actions/invitation-action-state";
import { respondInvitationAction } from "../actions/invitation.actions";

/**
 * Hook useRespondInvitation: Fachada de acción para responder invitaciones.
 *
 * - **¿Qué hace?**: Enlaza la Server Action `respondInvitationAction` con el hook `useActionState`,
 *   exponiendo el error actual (`error`), la función despachadora para el formulario (`respond`) y el estado de transición (`pending`).
 * - **¿Cómo interactúa con el sistema en general?**: Se consume en `InvitationAnswerActions`.
 * - **¿Cuál es su importancia?**: Encapsula el manejo de estado de mutación, manteniendo limpio y declarativo el componente de UI.
 */
export function useRespondInvitation() {
  const [state, respond, pending] = useActionState(respondInvitationAction, initialInvitationActionState);
  return { error: state.error, respond, pending };
}
