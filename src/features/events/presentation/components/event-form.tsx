/**
 * @file event-form.tsx
 * @description Client Component para el formulario unificado de reporte y edición de Eventos.
 * Maneja entradas de fecha y hora local de Colombia, validación por campos y feedback inmediato.
 */

"use client";

import { useActionState } from "react";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { Alert, Button, SelectField, TextareaField, TextField } from "@/shared/presentation/components";
import type { Event } from "../../domain/entities/event";
import { isoToColombiaLocal } from "../../domain/rules/event-input";
import { EVENT_ADDRESS_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH } from "../../domain/rules/event-limits";
import { reportEventAction, updateEventAction } from "../actions/event.actions";
import { initialEventFormState } from "../actions/event-form-state";

/**
 * Formulario interactivo para reportar un evento comunitario o editar un reporte en revisión.
 *
 * - **¿Qué hace?**:
 *   Renderiza inputs controlados y no controlados para: título, descripción opcional, selector de zona,
 *   dirección libre opcional y rango temporal de inicio y fin en formato de hora local colombiana (`datetime-local`).
 *   Si recibe un `event` existente, entra en modo edición enlazando a `updateEventAction`; en caso contrario, se enlaza a `reportEventAction`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utiliza `useActionState` con las Server Actions correspondientes. Se utiliza en la página `/events/new` y en `EventDetail`.
 *
 * - **¿Cuál es su importancia?**:
 *   Reutiliza la lógica de presentación y captura de datos (DRY), gestionando conversiones horarias y errores de validación sin recargar.
 */
export function EventForm({ event, zones }: { event?: Event; zones: readonly Pick<Zone, "id" | "name">[] }) {
  const editing = event !== undefined;
  const [state, formAction, pending] = useActionState(
    editing ? updateEventAction : reportEventAction,
    initialEventFormState(
      editing
        ? {
            title: event.title,
            description: event.description ?? "",
            zoneId: String(event.zone.id),
            addressText: event.addressText ?? "",
            startDate: isoToColombiaLocal(event.startDate),
            endDate: isoToColombiaLocal(event.endDate),
          }
        : undefined,
    ),
  );

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}
      {editing && <input type="hidden" name="eventId" value={event.id} />}

      <TextField
        label="Título"
        name="title"
        required
        maxLength={EVENT_TITLE_MAX_LENGTH}
        placeholder="Feria artesanal en la plaza"
        defaultValue={state.values.title}
        error={state.errors.title}
      />
      <TextareaField
        label="Descripción"
        name="description"
        rows={3}
        placeholder="Qué vas a encontrar y por qué lo reportas"
        hint="Opcional."
        defaultValue={state.values.description}
        error={state.errors.description}
      />
      <SelectField label="Zona" name="zoneId" required defaultValue={state.values.zoneId} error={state.errors.zoneId}>
        <option value="" disabled>
          Elige una zona
        </option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Dirección"
        name="addressText"
        maxLength={EVENT_ADDRESS_MAX_LENGTH}
        placeholder="Plaza de Caycedo"
        hint="Opcional. Dónde ocurre, si no es un lugar registrado."
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

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Guardando…" : editing ? "Guardar cambios" : "Reportar evento"}
        </Button>
      </div>
    </form>
  );
}
