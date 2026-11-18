"use client";

import { useActionState } from "react";
import { deleteVenueAction, verifyVenueAction } from "../actions/venue.actions";

/**
 * Hook fachada para la verificación administrativa de un lugar o recinto.
 *
 * - **¿Qué hace?**: Enlaza `verifyVenueAction` con `useActionState`, proveyendo `state`, `formAction` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `VerifyVenueButton` en el panel administrativo de lugares.
 * - **¿Cuál es su importancia?**: Habilita a los administradores a certificar la autenticidad de un lugar sin recargas completas.
 */
export function useVerifyVenue() {
  const [state, formAction, pending] = useActionState(verifyVenueAction, {});
  return { state, formAction, pending };
}

/**
 * Hook fachada para la eliminación de un lugar registrado.
 *
 * - **¿Qué hace?**: Enlaza `deleteVenueAction` con `useActionState`, proveyendo `state`, `formAction` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `DeleteVenueButton` en el panel de mis lugares y en el panel administrativo.
 * - **¿Cuál es su importancia?**: Gestiona el borrado seguro con confirmación y retroalimentación reactiva inmediata.
 */
export function useDeleteVenue() {
  const [state, formAction, pending] = useActionState(deleteVenueAction, {});
  return { state, formAction, pending };
}
