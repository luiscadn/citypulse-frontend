"use client";

import { useActionState } from "react";
import type { Event } from "../../domain/entities/event";
import { isoToColombiaLocal } from "../../domain/rules/event-input";
import { reportEventAction, updateEventAction } from "../actions/event.actions";
import { initialEventFormState } from "../actions/event-form-state";

/**
 * Hook fachada polimórfico para el formulario de reportes de eventos (reportar o editar).
 *
 * - **¿Qué hace?**: Identifica si se está editando un evento (`editing = event !== undefined`),
 *   transforma las fechas ISO UTC a horario local de Colombia para `<input type="datetime-local">` (`isoToColombiaLocal`),
 *   selecciona `updateEventAction` o `reportEventAction` e inicializa el estado con los valores del evento.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente `EventForm` en `/events/report` y `/events/[id]/edit`.
 * - **¿Cuál es su importancia?**: Centraliza la adaptación bidireccional de formatos de fecha entre la UI local y el backend UTC.
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
