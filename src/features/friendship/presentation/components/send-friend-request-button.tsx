"use client";

import { useActionState } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { initialFriendshipActionState } from "../actions/friendship-action-state";
import { sendFriendRequestAction } from "../actions/friendship.actions";

/** Botón para enviar una solicitud de amistad a una persona encontrada. */
export function SendFriendRequestButton({ targetUserId }: { targetUserId: number }) {
  const [state, formAction, pending] = useActionState(
    sendFriendRequestAction,
    initialFriendshipActionState,
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="targetUserId" value={targetUserId} />
      <Button type="submit" size="sm" loading={pending}>
        Enviar solicitud
      </Button>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
    </form>
  );
}
