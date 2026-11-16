import Link from "next/link";
import { EventOrigin } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import type { Event } from "../../domain/entities/event";
import { EventStatusBadge } from "./event-status-badge";

/** Tarjeta de un evento en un listado; lleva a su detalle. */
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
