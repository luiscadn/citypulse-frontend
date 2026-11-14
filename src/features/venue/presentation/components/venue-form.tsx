"use client";

import { useActionState } from "react";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { Alert, Button, SelectField, TextareaField, TextField } from "@/shared/presentation/components";
import type { Venue } from "../../domain/entities/venue";
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_DESCRIPTION_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from "../../domain/rules/venue-limits";
import { createVenueAction, updateVenueAction } from "../actions/venue.actions";
import { initialVenueFormState } from "../actions/venue-form-state";

/**
 * Formulario para registrar un lugar (OWNER) o editar uno existente (su OWNER o un ADMIN).
 * Sin `venue` registra; con `venue` edita ese lugar.
 */
export function VenueForm({
  venue,
  zones,
  warnVerification = false,
}: {
  venue?: Venue;
  zones: readonly Pick<Zone, "id" | "name">[];
  /** Avisar que cambiar nombre, dirección o zona quita la verificación (OWNER con lugar verificado) */
  warnVerification?: boolean;
}) {
  const editing = venue !== undefined;
  const [state, formAction, pending] = useActionState(
    editing ? updateVenueAction : createVenueAction,
    initialVenueFormState(
      editing
        ? {
            name: venue.name,
            address: venue.address ?? "",
            description: venue.description ?? "",
            zoneId: String(venue.zone.id),
          }
        : undefined,
    ),
  );

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}
      {editing && <input type="hidden" name="venueId" value={venue.id} />}
      {warnVerification && (
        <Alert tone="warning">
          Si cambias el nombre, la dirección o la zona, el lugar vuelve a quedar pendiente de verificación.
        </Alert>
      )}

      <TextField
        label="Nombre"
        name="name"
        required
        maxLength={VENUE_NAME_MAX_LENGTH}
        placeholder="Teatro Jorge Isaacs"
        defaultValue={state.values.name}
        error={state.errors.name}
      />
      <TextField
        label="Dirección"
        name="address"
        required
        maxLength={VENUE_ADDRESS_MAX_LENGTH}
        placeholder="Cra 3 # 12-28"
        defaultValue={state.values.address}
        error={state.errors.address}
      />
      <SelectField
        label="Zona"
        name="zoneId"
        required
        defaultValue={state.values.zoneId}
        error={state.errors.zoneId}
      >
        <option value="" disabled>
          Elige una zona
        </option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </SelectField>
      <TextareaField
        label="Descripción"
        name="description"
        rows={3}
        maxLength={VENUE_DESCRIPTION_MAX_LENGTH}
        placeholder="Teatro histórico del centro"
        hint="Opcional."
        defaultValue={state.values.description}
        error={state.errors.description}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Guardando…" : editing ? "Guardar cambios" : "Registrar lugar"}
        </Button>
      </div>
    </form>
  );
}
