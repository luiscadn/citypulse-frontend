"use client";

import { useActionState } from "react";
import { deleteZoneAction } from "../actions/zone.actions";

/**
 * Hook fachada para eliminar una zona geográfica en el panel administrativo.
 *
 * - **¿Qué hace?**: Enlaza la Server Action `deleteZoneAction` con el hook `useActionState`,
 *   exponiendo el estado (`state`), la función del formulario (`formAction`) y la transición (`pending`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `DeleteZoneButton` en el listado de comunas/corregimientos.
 * - **¿Cuál es su importancia?**: Aísla la mutación destructiva de la interfaz de usuario, proveyendo estado de carga reactivo.
 */
export function useDeleteZone() {
  const [state, formAction, pending] = useActionState(deleteZoneAction, {});
  return { state, formAction, pending };
}
