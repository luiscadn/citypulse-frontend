"use client";

import { useState } from "react";
import { Alert, Button, TextareaField } from "@/shared/presentation/components";
import { REJECTION_REASON_MAX_LENGTH } from "../../domain/rules/event-limits";
import { useReviewReport } from "../hooks/use-review-report";

/** Confirmar o rechazar un reporte (solo ADMIN). Rechazar pide un motivo, que verá su autor. */
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
