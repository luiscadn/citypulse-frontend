/**
 * @file venue-row.tsx
 * @description Componentes de visualización para ítems y listas de Lugares (Venues).
 */

import Link from "next/link";
import { ChevronRightIcon, MapPinIcon } from "@/shared/presentation/components/icons";
import type { Venue } from "../../domain/entities/venue";
import { VenueStatusBadge } from "./venue-status-badge";

/**
 * Fila interactiva que presenta un lugar dentro de una lista.
 *
 * - **¿Qué hace?**:
 *   Muestra un elemento `<li>` navegable que incluye el nombre del lugar, la dirección física con ícono de chincheta,
 *   el nombre de la zona geográfica, la insignia de estado (`VenueStatusBadge`) y una flecha indicativa.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Enlaza directamente hacia la página de detalle `/venues/[id]`. Es utilizado por `VenueList` y `MyVenues`.
 *
 * - **¿Cuál es su importancia?**:
 *   Condensa la información más relevante de cada venue en un diseño responsivo y accesible,
 *   optimizando el espacio tanto en pantallas móviles como de escritorio.
 */
export function VenueRow({ venue }: { venue: Venue }) {
  return (
    <li>
      <Link
        href={`/venues/${venue.id}`}
        className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors hover:bg-accent-soft/60 focus-visible:bg-neutral-soft focus-visible:outline-none sm:flex-nowrap"
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
        <ChevronRightIcon className="hidden text-ink-muted transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-accent-strong sm:block" />
      </Link>
    </li>
  );
}

/**
 * Contenedor estilizado para agrupar filas de lugares.
 *
 * - **¿Qué hace?**: Renderiza un elemento `<ul>` con bordes redondeados y divisores sutiles entre filas.
 * - **¿Cómo interactúa con el sistema en general?**: Envuelve múltiples instancias de `VenueRow`.
 * - **¿Cuál es su importancia?**: Proporciona coherencia estética y estructura semántica de lista ordenada para accesibilidad.
 */
export function VenueRows({ children }: { children: React.ReactNode }) {
  return <ul className="stagger divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">{children}</ul>;
}
