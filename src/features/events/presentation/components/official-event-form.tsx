"use client";

import type { Venue } from "@/features/venue/domain/entities/venue";
import { EventVisibility } from "@/shared/domain/enums";
import { Alert, Button, SelectField, TextareaField, TextField } from "@/shared/presentation/components";
import { EVENT_ADDRESS_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH } from "../../domain/rules/event-limits";
import { useOfficialEventForm } from "../hooks/use-official-event-form";

type VenueOption = Pick<Venue, "id" | "name"> & { zone: Pick<Venue["zone"], "name"> };

/** Publica un evento oficial en uno de tus lugares (OWNER o ADMIN). La zona es la del lugar. */
export function OfficialEventForm({ venues }: { venues: readonly VenueOption[] }) {
  const { state, formAction, pending } = useOfficialEventForm();

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}

      <TextField
        label="Título"
        name="title"
        required
        maxLength={EVENT_TITLE_MAX_LENGTH}
        placeholder="Concierto de jazz al aire libre"
        defaultValue={state.values.title}
        error={state.errors.title}
      />
      <TextareaField
        label="Descripción"
        name="description"
        rows={3}
        placeholder="Qué va a pasar y para quién es"
        hint="Opcional."
        defaultValue={state.values.description}
        error={state.errors.description}
      />
      <SelectField label="Lugar" name="venueId" required defaultValue={state.values.venueId} error={state.errors.venueId}>
        <option value="" disabled>
          Elige uno de tus lugares
        </option>
        {venues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.name} · {venue.zone.name}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Indicaciones"
        name="addressText"
        maxLength={EVENT_ADDRESS_MAX_LENGTH}
        placeholder="Ej.: Entrada por la puerta norte"
        hint="Opcional."
        defaultValue={state.values.addressText}
        error={state.errors.addressText}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Empieza"
          name="startDate"
          type="datetime-local"
          required
          hint="Hora de Colombia."
          defaultValue={state.values.startDate}
          error={state.errors.startDate}
        />
        <TextField
          label="Termina"
          name="endDate"
          type="datetime-local"
          required
          hint="Hora de Colombia."
          defaultValue={state.values.endDate}
          error={state.errors.endDate}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Visibilidad"
          name="visibility"
          required
          hint="Uno privado solo lo ven sus invitados."
          defaultValue={state.values.visibility}
          error={state.errors.visibility}
        >
          <option value={EventVisibility.PUBLICO}>Público</option>
          <option value={EventVisibility.PRIVADO}>Privado</option>
        </SelectField>
        <TextField
          label="Cupo"
          name="capacity"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          placeholder="Sin límite"
          hint="Opcional."
          defaultValue={state.values.capacity}
          error={state.errors.capacity}
        />
        <TextField
          label="Entrada (COP)"
          name="ticketPrice"
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          placeholder="0 = gratis"
          hint="Opcional."
          defaultValue={state.values.ticketPrice}
          error={state.errors.ticketPrice}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Publicando…" : "Publicar evento"}
        </Button>
      </div>
    </form>
  );
}
