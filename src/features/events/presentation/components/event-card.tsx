/**
 * @file event-card.tsx
 * @description Componente de presentación para tarjetas de Eventos en listados.
 */

import Link from "next/link";
import { EventOrigin } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import type { Event } from "../../domain/entities/event";
import { EventStatusBadge } from "./event-status-badge";

/**
 * Tarjeta interactiva que sintetiza un evento en la cartelera o cuadrículas.
 *
 * - **¿Qué hace?**:
 *   Muestra un bloque `<li>` con enlace navegable hacia `/events/[id]`, presentando el título,
 *   insignia de estado (`EventStatusBadge`), fecha y hora formateadas, ubicación (lugar o dirección),
 *   nombre de la zona geográfica y distintivo de origen (Oficial vs. Reporte ciudadano).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Renderizado masivamente por `EventList` para desplegar la grilla de eventos disponibles.
 *
 * - **¿Cuál es su importancia?**:
 *   Ofrece un resumen visual accesible y atractivo con estados claros que facilitan el escaneo rápido de actividades culturales.
 */
export function EventCard({ event }: { event: Event }) {
  const place = event.venue?.name ?? event.addressText;

  return (
    <li>
      <Link
        href={`/events/${event.id}`}
        className="flex h-full flex-col gap-2 rounded-lg border border-line bg-surface px-5 py-4 transition-colors hover:border-primary hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-base font-semibold text-ink">{event.title}</span>
          <EventStatusBadge status={event.status} />
        </div>
        <span className="text-sm text-ink-muted">{formatDateTime(event.startDate)}</span>
        {place && <span className="text-sm text-ink-muted">{place}</span>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-primary-strong">{event.zone.name}</span>
          <Badge tone={event.origin === EventOrigin.OFICIAL ? "info" : "neutral"}>
            {event.origin === EventOrigin.OFICIAL ? "Oficial" : "Reporte ciudadano"}
          </Badge>
        </div>
      </Link>
    </li>
  );
}
