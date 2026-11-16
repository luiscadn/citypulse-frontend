"use client";

import { useActionState } from "react";
import { Alert } from "@/shared/presentation/components";
import { ConfirmSubmit } from "@/shared/presentation/components/confirm-submit";
import { deleteZoneAction } from "../actions/zone.actions";

/** Borra la zona tras pedir confirmación. Si tiene lugares o eventos, el backend lo impide y se explica. */
export function DeleteZoneButton({ zoneId, zoneName }: { zoneId: number; zoneName: string }) {
  const [state, formAction, pending] = useActionState(deleteZoneAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="zoneId" value={zoneId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <ConfirmSubmit
        label="Eliminar zona"
        pendingLabel="Eliminando…"
        message={`¿Eliminar la zona "${zoneName}"? Esta acción no se puede deshacer.`}
        pending={pending}
      />
    </form>
  );
}
