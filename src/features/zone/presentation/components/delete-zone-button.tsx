"use client";

import { Alert } from "@/shared/presentation/components";
import { ConfirmSubmit } from "@/shared/presentation/components/confirm-submit";
import { useDeleteZone } from "../hooks/use-delete-zone";

/** Borra la zona tras pedir confirmación. Si tiene lugares o eventos, el backend lo impide y se explica. */
export function DeleteZoneButton({ zoneId, zoneName }: { zoneId: number; zoneName: string }) {
  const { state, formAction, pending } = useDeleteZone();

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
