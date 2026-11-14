"use client";

import { useActionState, type FormEvent } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { deleteZoneAction } from "../actions/zone.actions";

/** Borra la zona tras pedir confirmación. Si tiene lugares o eventos, el backend lo impide y se explica. */
export function DeleteZoneButton({ zoneId, zoneName }: { zoneId: number; zoneName: string }) {
  const [state, formAction, pending] = useActionState(deleteZoneAction, {});

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`¿Eliminar la zona "${zoneName}"? Esta acción no se puede deshacer.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={confirmDelete} className="flex flex-col gap-3">
      <input type="hidden" name="zoneId" value={zoneId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <div>
        <Button type="submit" variant="danger" loading={pending}>
          {pending ? "Eliminando…" : "Eliminar zona"}
        </Button>
      </div>
    </form>
  );
}
