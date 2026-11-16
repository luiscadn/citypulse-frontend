"use client";

import { useActionState } from "react";
import { initialInvitationActionState } from "../actions/invitation-action-state";
import { respondInvitationAction } from "../actions/invitation.actions";

/** Hook fachada para aceptar o rechazar una invitación: el formulario usa `respond` como action. */
export function useRespondInvitation() {
  const [state, respond, pending] = useActionState(respondInvitationAction, initialInvitationActionState);
  return { error: state.error, respond, pending };
}
