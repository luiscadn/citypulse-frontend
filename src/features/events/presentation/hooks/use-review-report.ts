"use client";

import { useActionState } from "react";
import { confirmReportAction, rejectReportAction } from "../actions/moderation.actions";

/** Hook fachada de la moderación de un reporte: confirmarlo o rechazarlo con un motivo. */
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
