"use client";

import { useActionState } from "react";
import { cancelEventAction } from "../actions/event.actions";

/**
 * Hook fachada para la cancelación de un evento por parte de su autor o administrador.
 *
 * - **¿Qué hace?**: Enlaza `cancelEventAction` con `useActionState`, proveyendo `state`, `formAction` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente `CancelEventButton` en el detalle del evento.
 * - **¿Cuál es su importancia?**: Ofrece una mutación segura con estado de carga no bloqueante.
 */
export function useCancelEvent() {
  const [state, formAction, pending] = useActionState(cancelEventAction, {});
  return { state, formAction, pending };
}
