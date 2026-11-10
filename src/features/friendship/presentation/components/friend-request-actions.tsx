"use client";

import { useActionState } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { initialFriendshipActionState } from "../actions/friendship-action-state";
import { respondFriendRequestAction } from "../actions/friendship.actions";

/** Botones para aceptar o rechazar una solicitud recibida. */
export function FriendRequestActions({ requestId }: { requestId: number }) {
  const [state, formAction, pending] = useActionState(
    respondFriendRequestAction,
    initialFriendshipActionState,
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="requestId" value={requestId} />
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
