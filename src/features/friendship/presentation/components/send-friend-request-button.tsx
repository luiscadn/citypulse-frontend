"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { useSendFriendRequest } from "../hooks/use-friend-request-actions";

/** Botón para enviar una solicitud de amistad a una persona encontrada. */
export function SendFriendRequestButton({ targetUserId }: { targetUserId: number }) {
  const { error, send, pending } = useSendFriendRequest();

  return (
    <form action={send} className="flex flex-col items-end gap-2">
      <input type="hidden" name="targetUserId" value={targetUserId} />
      <Button type="submit" size="sm" loading={pending}>
        Enviar solicitud
      </Button>
      {error && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
