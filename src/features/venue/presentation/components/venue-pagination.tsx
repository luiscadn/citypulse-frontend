/**
 * @file venue-pagination.tsx
 * @description Componente de paginación accesible para el listado de Lugares (Venues).
 * Conserva los filtros aplicados al navegar entre páginas.
 */

import Link from "next/link";
import { buttonClasses } from "@/shared/presentation/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/presentation/components/icons";
import type { VenueFilters } from "../../domain/entities/venue";

/**
 * Genera la URL con los parámetros de búsqueda preservados para una página específica.
 */
function pageHref(filters: VenueFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.zoneId !== null) params.set("zoneId", String(filters.zoneId));
  if (filters.isVerified !== null) params.set("isVerified", String(filters.isVerified));
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/venues?${query}` : "/venues";
}

/**
 * Enlace de navegación para cambio de página, con estado inactivo accesible si no hay enlace.
 */
function PageLink({ href, children }: { href: string | null; children: React.ReactNode }) {
  const className = buttonClasses("secondary", "sm");
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <span className={buttonClasses("secondary", "sm", "pointer-events-none opacity-55")} aria-disabled>
      {children}
    </span>
  );
}

/**
 * Controles de paginación para el listado de lugares.
 *
 * - **¿Qué hace?**:
 *   Muestra botones de "Anterior" y "Siguiente" y el indicador de página actual sobre el total ("Página X de Y").
 *   Si solo hay una página disponible (`lastPage <= 1`), se oculta automáticamente.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocado al final de `VenueList`. Construye URLs con los filtros existentes garantizando una navegación fluida.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite navegar por grandes volúmenes de datos sin perder el contexto de los filtros seleccionados,
 *   cumpliendo pautas de accesibilidad para lectores de pantalla (`aria-label="Páginas"`).
 */
export function VenuePagination({ filters, lastPage }: { filters: VenueFilters; lastPage: number }) {
  if (lastPage <= 1) return null;
  const { page } = filters;

  return (
    <nav aria-label="Páginas" className="flex items-center justify-between gap-3 text-sm">
      <PageLink href={page > 1 ? pageHref(filters, page - 1) : null}>
        <ChevronLeftIcon />
        Anterior
      </PageLink>
      <span className="text-ink-muted tabular-nums">
        Página {page} de {lastPage}
      </span>
      <PageLink href={page < lastPage ? pageHref(filters, page + 1) : null}>
        Siguiente
        <ChevronRightIcon />
      </PageLink>
    </nav>
  );
}
