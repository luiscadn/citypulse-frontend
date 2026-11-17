import { EventStatus } from "@/shared/domain/enums";
import { Badge, type Tone } from "@/shared/presentation/components";

const STATUS: Record<EventStatus, { label: string; tone: Tone }> = {
  [EventStatus.REPORTADO]: { label: "En revisión", tone: "warning" },
  [EventStatus.CONFIRMADO]: { label: "Confirmado", tone: "success" },
  [EventStatus.RECHAZADO]: { label: "Rechazado", tone: "danger" },
  [EventStatus.CANCELADO]: { label: "Cancelado", tone: "neutral" },
};

/** Estado de un evento: en revisión, confirmado por un ADMIN, rechazado o cancelado. */
export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

/** Texto de cada estado, para los filtros. */
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.REPORTADO]: STATUS[EventStatus.REPORTADO].label,
  [EventStatus.CONFIRMADO]: STATUS[EventStatus.CONFIRMADO].label,
  [EventStatus.RECHAZADO]: STATUS[EventStatus.RECHAZADO].label,
  [EventStatus.CANCELADO]: STATUS[EventStatus.CANCELADO].label,
};
