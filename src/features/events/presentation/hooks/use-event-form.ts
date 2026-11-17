"use client";

import { useActionState } from "react";
import type { Event } from "../../domain/entities/event";
import { isoToColombiaLocal } from "../../domain/rules/event-input";
import { reportEventAction, updateEventAction } from "../actions/event.actions";
import { initialEventFormState } from "../actions/event-form-state";

/**
 * Hook fachada del formulario de evento: elige la acción (reportar o editar)
 * y expone su estado. El componente no conoce las acciones del servidor.
 */
export function useEventForm(event?: Event) {
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
  return { editing, state, formAction, pending };
}
