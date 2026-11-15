"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { useRespondFriendRequest } from "../hooks/use-friend-request-actions";

/** Botones para aceptar o rechazar una solicitud recibida. */
export function FriendRequestActions({ requestId }: { requestId: number }) {
  const { error, respond, pending } = useRespondFriendRequest();

  return (
    <form action={respond} className="flex flex-col items-end gap-2">
      <input type="hidden" name="requestId" value={requestId} />
      <div className="flex gap-2">
        <Button type="submit" name="answer" value="ACEPTADA" size="sm" disabled={pending}>
          Aceptar
        </Button>
        <Button type="submit" name="answer" value="RECHAZADA" size="sm" variant="secondary" disabled={pending}>
          Rechazar
        </Button>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
