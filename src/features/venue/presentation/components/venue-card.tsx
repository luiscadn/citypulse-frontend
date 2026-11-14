import Link from "next/link";
import type { Venue } from "../../domain/entities/venue";
import { VenueStatusBadge } from "./venue-status-badge";

/** Tarjeta de un lugar en un listado; lleva a su detalle. */
export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <li>
      <Link
        href={`/venues/${venue.id}`}
        className="flex h-full flex-col gap-2 rounded-lg border border-line bg-surface px-5 py-4 transition-colors hover:border-primary hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-base font-semibold text-ink">{venue.name}</span>
          <VenueStatusBadge isVerified={venue.isVerified} />
        </div>
        <span className="text-sm text-ink-muted">{venue.address ?? "Sin dirección"}</span>
        <span className="text-xs font-semibold text-primary-strong">{venue.zone.name}</span>
      </Link>
    </li>
  );
}
