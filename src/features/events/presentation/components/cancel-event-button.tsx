"use client";

import { useState } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { useCancelEvent } from "../hooks/use-cancel-event";

/**
 * Cancela el evento tras pedir confirmación en la misma página (sin window.confirm).
 * El evento no se borra: queda con estado CANCELADO.
 */
export function CancelEventButton({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const { state, formAction, pending } = useCancelEvent();
  const [confirming, setConfirming] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {confirming ? (
        <>
          <p className="text-sm text-ink">¿Cancelar &quot;{eventTitle}&quot;? Seguirá visible, marcado como cancelado.</p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="danger" loading={pending}>
              {pending ? "Cancelando…" : "Sí, cancelar evento"}
            </Button>
            <Button type="button" variant="secondary" disabled={pending} onClick={() => setConfirming(false)}>
              No, volver
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Button type="button" variant="danger" onClick={() => setConfirming(true)}>
            Cancelar evento
          </Button>
        </div>
      )}
    </form>
  );
}
