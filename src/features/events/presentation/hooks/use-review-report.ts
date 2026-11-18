"use client";

import { useActionState } from "react";
import { confirmReportAction, rejectReportAction } from "../actions/moderation.actions";

/**
 * Hook fachada para la moderación administrativa de reportes ciudadanos (confirmar o rechazar).
 *
 * - **¿Qué hace?**: Combina dos `useActionState` independientes en un único hook coordenado:
 *   uno para confirmar (`confirmReportAction`) y otro para rechazar con motivo (`rejectReportAction`),
 *   unificando `pending` (`confirming || rejecting`) y exponiendo el error combinado y el motivo actual.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el panel de moderación `ReviewReportPanel`.
 * - **¿Cuál es su importancia?**: Simplifica la interacción administrativa combinando dos flujos de mutación en una única interfaz cohesiva.
 */
export function useReviewReport() {
  const [confirmState, confirm, confirming] = useActionState(confirmReportAction, {});
  const [rejectState, reject, rejecting] = useActionState(rejectReportAction, { reason: "" });
  return {
    confirm,
    reject,
    pending: confirming || rejecting,
    error: confirmState.error ?? rejectState.error,
    reason: rejectState.reason,
  };
}
