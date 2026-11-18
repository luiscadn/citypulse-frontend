/**
 * @file venue-form.tsx
 * @description Client Component para el formulario unificado de creación y edición de Lugares (Venues).
 * Integra autocompletado de direcciones mediante `PlaceSearch` y validación progresiva.
 */

"use client";

import { useActionState, useRef } from "react";
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
import { createVenueAction, updateVenueAction } from "../actions/venue.actions";
import { initialVenueFormState } from "../actions/venue-form-state";

/**
 * Formulario interactivo para registrar un nuevo lugar o editar uno existente.
 *
 * - **¿Qué hace?**:
 *   Maneja campos para nombre, dirección, zona y descripción. Permite autocompletar nombre y dirección
 *   seleccionando un resultado en el buscador cartográfico integrado `PlaceSearch`. Muestra alertas
 *   de éxito, error y advertencias sobre pérdida de verificación si un OWNER edita campos clave.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Se enlaza a `createVenueAction` o `updateVenueAction` mediante `useActionState`. Es utilizado
 *   tanto en la barra lateral de `MyVenues` como en la tarjeta de edición de `VenueDetail`.
 *
 * - **¿Cuál es su importancia?**:
 *   Reutiliza la lógica y componentes de interfaz para creación y actualización (DRY), enriqueciendo
 *   la captura de datos con geobúsqueda de Google Places y validación accesible.
 */
export function VenueForm({
  venue,
  zones,
  warnVerification = false,
}: {
  venue?: Venue;
  zones: readonly Pick<Zone, "id" | "name">[];
  /** Indica si se debe advertir al usuario que editar revocará la verificación previa del lugar */
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

  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Llena directamente los campos del formulario con los datos elegidos en el buscador de lugares de Google Maps.
   */
  function fillFromPlace(place: Place) {
    const setField = (name: string, value: string) => {
      const field = formRef.current?.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = value;
    };
    setField("name", place.name.slice(0, VENUE_NAME_MAX_LENGTH));
    setField("address", place.address.slice(0, VENUE_ADDRESS_MAX_LENGTH));
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}
      {editing && <input type="hidden" name="venueId" value={venue.id} />}
      {warnVerification && (
        <Alert tone="warning">
          Si cambias el nombre, la dirección o la zona, el lugar vuelve a quedar pendiente de verificación.
        </Alert>
      )}

      <PlaceSearch onPick={fillFromPlace} />

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
