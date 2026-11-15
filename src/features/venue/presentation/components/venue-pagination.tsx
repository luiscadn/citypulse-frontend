import Link from "next/link";
import { buttonClasses } from "@/shared/presentation/components";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/presentation/components/icons";
import type { VenueFilters } from "../../domain/entities/venue";

function pageHref(filters: VenueFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.zoneId !== null) params.set("zoneId", String(filters.zoneId));
  if (filters.isVerified !== null) params.set("isVerified", String(filters.isVerified));
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/venues?${query}` : "/venues";
}

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

/** Anterior / siguiente conservando los filtros. No se muestra si hay una sola página. */
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
