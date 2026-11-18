"use client";

import { useActionState } from "react";
import { emptyOfficialEventFormValues } from "../actions/event-form-state";
import { publishOfficialEventAction } from "../actions/official-event.actions";

/**
 * Hook fachada para el formulario de publicación de eventos oficiales.
 *
 * - **¿Qué hace?**: Vincula la Server Action `publishOfficialEventAction` con `useActionState`,
 *   inicializando con valores vacíos (`emptyOfficialEventFormValues`) y retornando `state`, `formAction` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente `OfficialEventForm`.
 * - **¿Cuál es su importancia?**: Aísla el manejo del estado del formulario y la validación de errores por campo.
 */
export function useOfficialEventForm() {
  const [state, formAction, pending] = useActionState(publishOfficialEventAction, {
    values: emptyOfficialEventFormValues,
    errors: {},
  });
  return { state, formAction, pending };
}
