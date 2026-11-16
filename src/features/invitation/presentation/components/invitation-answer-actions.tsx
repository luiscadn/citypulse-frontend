"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { useRespondInvitation } from "../hooks/use-respond-invitation";

/** Botones para aceptar o rechazar una invitación recibida. */
export function InvitationAnswerActions({ invitationId }: { invitationId: number }) {
  const { error, respond, pending } = useRespondInvitation();

  return (
    <form action={respond} className="flex flex-col items-end gap-2">
      <input type="hidden" name="invitationId" value={invitationId} />
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
