"use client";

import { useActionState, type FormEvent } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { deleteVenueAction, verifyVenueAction } from "../actions/venue.actions";

/** Marca el lugar como verificado (solo ADMIN). */
export function VerifyVenueButton({ venueId }: { venueId: number }) {
  const [state, formAction, pending] = useActionState(verifyVenueAction, {});

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
  const [state, formAction, pending] = useActionState(deleteVenueAction, {});

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`¿Eliminar "${venueName}"? Sus eventos se conservan, pero quedan sin lugar.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={confirmDelete} className="flex flex-col gap-3">
      <input type="hidden" name="venueId" value={venueId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <div>
        <Button type="submit" variant="danger" loading={pending}>
          {pending ? "Eliminando…" : "Eliminar lugar"}
        </Button>
      </div>
    </form>
  );
}
