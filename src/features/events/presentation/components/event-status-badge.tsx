/**
 * @file event-status-badge.tsx
 * @description Componentes e insignias para representar visualmente el estado de moderación de un Evento.
 */

import { EventStatus } from "@/shared/domain/enums";
import { Badge, type Tone } from "@/shared/presentation/components";

/**
 * Mapeo de estados de evento a etiquetas legibles y tonos visuales del diseño.
 */
const STATUS: Record<EventStatus, { label: string; tone: Tone }> = {
  [EventStatus.REPORTADO]: { label: "En revisión", tone: "warning" },
  [EventStatus.CONFIRMADO]: { label: "Confirmado", tone: "success" },
  [EventStatus.RECHAZADO]: { label: "Rechazado", tone: "danger" },
  [EventStatus.CANCELADO]: { label: "Cancelado", tone: "neutral" },
};

/**
 * Insignia visual indicadora del estado de moderación del evento.
 *
 * - **¿Qué hace?**: Muestra un `Badge` con punto indicador de color según si está en revisión, confirmado, rechazado o cancelado.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `EventCard` y en el encabezado de `EventDetail`.
 * - **¿Cuál es su importancia?**: Comunica rápidamente el grado de validez oficial y operatividad de un evento.
 */
export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

/**
 * Diccionario de textos amigables por cada estado, utilizado en los selectores de filtrado.
 */
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.REPORTADO]: STATUS[EventStatus.REPORTADO].label,
  [EventStatus.CONFIRMADO]: STATUS[EventStatus.CONFIRMADO].label,
  [EventStatus.RECHAZADO]: STATUS[EventStatus.RECHAZADO].label,
  [EventStatus.CANCELADO]: STATUS[EventStatus.CANCELADO].label,
};
