import Link from "next/link";
import { ChevronRightIcon, MapPinIcon } from "@/shared/presentation/components/icons";
import type { Venue } from "../../domain/entities/venue";
import { VenueStatusBadge } from "./venue-status-badge";

/** Fila de un lugar en un listado: nombre y dirección a la izquierda, zona y estado a la derecha. */
export function VenueRow({ venue }: { venue: Venue }) {
  return (
    <li>
      <Link
        href={`/venues/${venue.id}`}
        className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-neutral-soft focus-visible:bg-neutral-soft focus-visible:outline-none sm:flex-nowrap"
      >
        <div className="min-w-0 flex-1 basis-full sm:basis-auto">
          <p className="truncate font-semibold text-ink">{venue.name}</p>
          <p className="flex min-w-0 items-center gap-1 text-sm text-ink-muted">
            <MapPinIcon className="size-3.5" />
            <span className="truncate">{venue.address ?? "Sin dirección"}</span>
          </p>
        </div>
        <span className="text-sm text-ink-muted sm:w-40 sm:truncate">{venue.zone.name}</span>
        <span className="sm:w-28">
          <VenueStatusBadge isVerified={venue.isVerified} />
        </span>
        <ChevronRightIcon className="hidden text-ink-muted transition-transform group-hover:translate-x-0.5 sm:block" />
      </Link>
    </li>
  );
}

/** Contenedor de filas de lugares. */
export function VenueRows({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">{children}</ul>;
}
