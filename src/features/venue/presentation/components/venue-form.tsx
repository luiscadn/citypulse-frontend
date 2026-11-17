"use client";

import { useRef, useState } from "react";
import type { Place } from "@/features/maps/domain/entities/place";
import { PlaceSearch } from "@/features/maps/presentation/components/place-search";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { Alert, Button, SelectField, TextareaField, TextField } from "@/shared/presentation/components";
import type { Venue } from "../../domain/entities/venue";
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_DESCRIPTION_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from "../../domain/rules/venue-limits";
import { useVenueForm } from "../hooks/use-venue-form";

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
  const { editing, state, formAction, pending } = useVenueForm(venue);
  const formRef = useRef<HTMLFormElement>(null);
  const [located, setLocated] = useState(state.values.latitude !== "");

  function setField(name: string, value: string) {
    const field = formRef.current?.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.value = value;
  }

  // Los campos no son controlados (defaultValue): se llenan directo en el formulario
  function fillFromPlace(place: Place) {
    setField("name", place.name.slice(0, VENUE_NAME_MAX_LENGTH));
    setField("address", place.address.slice(0, VENUE_ADDRESS_MAX_LENGTH));
    const hasCoords = place.latitude !== null && place.longitude !== null;
    setField("latitude", hasCoords ? String(place.latitude) : "");
    setField("longitude", hasCoords ? String(place.longitude) : "");
    setLocated(hasCoords);
  }

  // Si la dirección se escribe a mano, la ubicación anterior ya no corresponde
  function forgetLocation() {
    if (!located) return;
    setField("latitude", "");
    setField("longitude", "");
    setLocated(false);
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}
      {venue && <input type="hidden" name="venueId" value={venue.id} />}
      {warnVerification && (
        <Alert tone="warning">
          Si cambias el nombre, la dirección, la ubicación o la zona, el lugar vuelve a quedar pendiente de verificación.
        </Alert>
      )}

      <PlaceSearch onPick={fillFromPlace} />
      <input type="hidden" name="latitude" defaultValue={state.values.latitude} />
      <input type="hidden" name="longitude" defaultValue={state.values.longitude} />
      <p className="flex items-center gap-2 text-sm text-ink-muted" role="status">
        <span aria-hidden className={located ? "pulse-dot" : "size-2 rounded-full bg-line-strong"} />
        {located
          ? "Ubicado en el mapa de la ciudad."
          : "Sin ubicación: búscalo en Google Maps para que aparezca en el mapa."}
      </p>

      <TextField
        label="Nombre"
        name="name"
        required
        maxLength={VENUE_NAME_MAX_LENGTH}
        placeholder="Ej.: Teatro Jorge Isaacs…"
        autoComplete="off"
        defaultValue={state.values.name}
        error={state.errors.name}
      />
      <TextField
        label="Dirección"
        name="address"
        required
        maxLength={VENUE_ADDRESS_MAX_LENGTH}
        placeholder="Ej.: Cra 3 # 12-28…"
        autoComplete="off"
        onInput={forgetLocation}
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
        placeholder="Ej.: Teatro histórico del centro…"
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
