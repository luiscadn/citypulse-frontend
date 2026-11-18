/**
 * @file event-pagination.tsx
 * @description Componente de paginación accesible para la cartelera de Eventos.
 * Preserva intactos los filtros de búsqueda y fechas al navegar entre páginas.
 */

import Link from "next/link";
import { buttonClasses } from "@/shared/presentation/components";
import type { EventFilters } from "../../domain/entities/event";

/**
 * Construye la URL de destino preservando todos los filtros activos (búsqueda, zona, estado, origen, fechas).
 */
function pageHref(filters: EventFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.search !== null) params.set("search", filters.search);
  if (filters.zoneId !== null) params.set("zoneId", String(filters.zoneId));
  if (filters.status !== null) params.set("status", filters.status);
  if (filters.origin !== null) params.set("origin", filters.origin);
  if (filters.from !== null) params.set("from", filters.from);
  if (filters.to !== null) params.set("to", filters.to);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/events?${query}` : "/events";
}

/**
 * Controles de paginación para el listado de eventos.
 *
 * - **¿Qué hace?**:
 *   Muestra botones de "← Anterior" y "Siguiente →" y la leyenda "Página X de Y".
 *   Se oculta automáticamente si el total de páginas es menor o igual a 1.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en la parte inferior de `EventList`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza la navegación fluida a través de catálogos extensos respetando la accesibilidad web.
 */
export function EventPagination({ filters, lastPage }: { filters: EventFilters; lastPage: number }) {
  if (lastPage <= 1) return null;
  const { page } = filters;

  return (
    <nav aria-label="Páginas" className="flex items-center justify-center gap-3 text-sm">
      {page > 1 ? (
        <Link href={pageHref(filters, page - 1)} className={buttonClasses("secondary", "sm")}>
          ← Anterior
        </Link>
      ) : (
        <span className={buttonClasses("secondary", "sm", "pointer-events-none opacity-55")} aria-disabled>
          ← Anterior
        </span>
      )}
      <span className="text-ink-muted">
        Página {page} de {lastPage}
      </span>
      {page < lastPage ? (
        <Link href={pageHref(filters, page + 1)} className={buttonClasses("secondary", "sm")}>
          Siguiente →
        </Link>
      ) : (
        <span className={buttonClasses("secondary", "sm", "pointer-events-none opacity-55")} aria-disabled>
          Siguiente →
        </span>
      )}
    </nav>
  );
}
