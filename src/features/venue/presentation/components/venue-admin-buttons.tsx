"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { ConfirmSubmit } from "@/shared/presentation/components/confirm-submit";
import { useDeleteVenue, useVerifyVenue } from "../hooks/use-venue-admin";

/** Marca el lugar como verificado (solo ADMIN). */
export function VerifyVenueButton({ venueId }: { venueId: number }) {
  const { state, formAction, pending } = useVerifyVenue();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="venueId" value={venueId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <div>
        <Button type="submit" loading={pending}>
          {pending ? "Verificando…" : "Verificar lugar"}
        </Button>
      </div>
    </form>
  );
}

/** Borra el lugar tras pedir confirmación. Sus eventos se conservan, sin lugar. */
export function DeleteVenueButton({ venueId, venueName }: { venueId: number; venueName: string }) {
  const { state, formAction, pending } = useDeleteVenue();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="venueId" value={venueId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <ConfirmSubmit
        label="Eliminar lugar"
        pendingLabel="Eliminando…"
        message={`¿Eliminar "${venueName}"? Sus eventos se conservan, pero quedan sin lugar.`}
        pending={pending}
      />
    </form>
  );
}
