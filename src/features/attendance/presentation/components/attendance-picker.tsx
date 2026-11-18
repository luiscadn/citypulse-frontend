"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { ATTENDANCE_STATUSES, type AttendanceStatus } from "../../domain/entities/attendance";
import { ATTENDANCE_LABEL } from "../attendance-labels";
import { useAttendance } from "../hooks/use-attendance";

/**
 * Selector interactivo de asistencia para un evento.
 *
 * - **¿Qué hace?**: Renderiza un grupo de botones correspondientes a cada opción de asistencia (`Asistiré`, `Tal vez`, `No iré`).
 *   Resalta con variante `primary` la opción seleccionada actualmente (`aria-pressed`), maneja estados de deshabilitación
 *   durante la mutación y muestra mensajes de error si la acción falla.
 * - **¿Cómo interactúa con el sistema en general?**: Consume el hook fachada `useAttendance` e interactúa con `respondAttendanceAction`.
 * - **¿Cuál es su importancia?**: Brinda una experiencia de usuario rápida y sin recargas de página para interactuar con eventos.
 */
export function AttendancePicker({
  eventId,
  initialStatus,
}: {
  eventId: string;
  initialStatus: AttendanceStatus | null;
}) {
  const { status, error, respond, pending } = useAttendance(initialStatus);

  return (
    <form action={respond} className="flex flex-col gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      {error && <Alert tone="danger">{error}</Alert>}
      <div role="group" aria-label="Mi asistencia" className="flex flex-wrap gap-2">
        {ATTENDANCE_STATUSES.map((option) => (
          <Button
            key={option}
            type="submit"
            name="status"
            value={option}
            size="sm"
            variant={status === option ? "primary" : "secondary"}
            aria-pressed={status === option}
            disabled={pending}
          >
            {ATTENDANCE_LABEL[option].action}
          </Button>
        ))}
      </div>
      {!status && <p className="text-xs text-ink-muted">Aún no has respondido.</p>}
    </form>
  );
}
