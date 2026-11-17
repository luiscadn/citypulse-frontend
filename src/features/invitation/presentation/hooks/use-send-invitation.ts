"use client";

import { useActionState } from "react";
import { initialInvitationActionState } from "../actions/invitation-action-state";
import { sendInvitationAction } from "../actions/invitation.actions";

/** Hook fachada para invitar a un amigo a un evento: el formulario usa `send` como action. */
export function useSendInvitation() {
  const [state, send, pending] = useActionState(sendInvitationAction, initialInvitationActionState);
  return { error: state.error, success: state.success, send, pending };
}
