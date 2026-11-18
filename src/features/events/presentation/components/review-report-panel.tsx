"use client";

import { useState } from "react";
import { Alert, Button, TextareaField } from "@/shared/presentation/components";
import { REJECTION_REASON_MAX_LENGTH } from "../../domain/rules/event-limits";
import { useReviewReport } from "../hooks/use-review-report";

/**
 * Panel interactivo para aprobar o rechazar reportes de eventos ciudadanos.
 *
 * - **¿Qué hace?**: Ofrece dos caminos de moderación:
 *   1. Confirmación inmediata mediante el botón "Confirmar" (dispara `confirm`).
 *   2. Apertura del subformulario de rechazo al pulsar "Rechazar…", solicitando un motivo obligatorio (`reason`)
 *      que será visible para el autor del reporte.
 * - **¿Cómo interactúa con el sistema en general?**: Utiliza el hook fachada `useReviewReport`, comunicándose
 *   con las Server Actions `confirmReportAction` y `rejectReportAction`. Incrustado en `ModerationQueue` y `EventDetail`.
 * - **¿Cuál es su importancia?**: Cumple con los requisitos funcionales RF-4.3 y RF-4.4, proporcionando una interfaz
 *   intuitiva, accesible y libre de diálogos modales molestos (`alert`/`prompt`).
 */
export function ReviewReportPanel({ eventId }: { eventId: string }) {
  const { confirm, reject, pending, error, reason } = useReviewReport();
  const [rejecting, setRejecting] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {error && <Alert tone="danger">{error}</Alert>}
      {rejecting ? (
        <form action={reject} className="flex flex-col gap-3" noValidate>
          <input type="hidden" name="eventId" value={eventId} />
          <TextareaField
            label="Motivo del rechazo"
            name="reason"
            rows={2}
            required
            maxLength={REJECTION_REASON_MAX_LENGTH}
            placeholder="Ej.: las evidencias no muestran el evento…"
            hint="Lo verá quien hizo el reporte."
            defaultValue={reason}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="danger" size="sm" loading={pending}>
              Rechazar reporte
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => setRejecting(false)}>
              Volver
            </Button>
          </div>
        </form>
      ) : (
        <form action={confirm} className="flex flex-wrap gap-2">
          <input type="hidden" name="eventId" value={eventId} />
          <Button type="submit" size="sm" loading={pending}>
            Confirmar
          </Button>
          <Button type="button" variant="secondary" size="sm" disabled={pending} onClick={() => setRejecting(true)}>
            Rechazar…
          </Button>
        </form>
      )}
    </div>
  );
}
