"use client";

import { useActionState } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { initialInvitationActionState } from "../actions/invitation-action-state";
import { respondInvitationAction } from "../actions/invitation.actions";

/** Botones para aceptar o rechazar una invitación recibida. */
export function InvitationAnswerActions({ invitationId }: { invitationId: number }) {
  const [state, formAction, pending] = useActionState(
    respondInvitationAction,
    initialInvitationActionState,
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="invitationId" value={invitationId} />
      <div className="flex gap-2">
        <Button type="submit" name="answer" value="ACEPTADA" size="sm" disabled={pending}>
          Aceptar
        </Button>
        <Button type="submit" name="answer" value="RECHAZADA" size="sm" variant="secondary" disabled={pending}>
          Rechazar
        </Button>
      </div>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
    </form>
  );
}
