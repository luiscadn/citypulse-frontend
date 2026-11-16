import Link from "next/link";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Alert, ButtonLink, Card, CardBody, EmptyState } from "@/shared/presentation/components";
import { eventContainer } from "../../di/event.container";
import { parseEventFilters } from "../../domain/rules/event-input";
import { canReportEvents } from "../../domain/rules/event-permissions";
import { EventCard } from "./event-card";
import { EventFilters } from "./event-filters";
import { EventPagination } from "./event-pagination";

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Listado de eventos con filtros y paginación. El backend decide cuáles ve cada persona.
 * Lee searchParams y la sesión: con Cache Components debe ir dentro de <Suspense>.
 */
export async function EventList({ searchParams }: { searchParams: PageProps<"/events">["searchParams"] }) {
  const params = await searchParams;
  const filters = parseEventFilters({
    zoneId: first(params.zoneId),
    status: first(params.status),
    origin: first(params.origin),
    search: first(params.search),
    page: first(params.page),
  });

  const [user, zones, page] = await Promise.all([
    getCurrentUser(),
    zoneContainer.listZonesUseCase.execute().catch(() => []),
    eventContainer.listEventsUseCase.execute(filters).catch(() => null),
  ]);

  const filtered =
    filters.zoneId !== null || filters.status !== null || filters.origin !== null || filters.search !== null;

  return (
    <div className="flex flex-col gap-6">
      {canReportEvents(user) && (
        <div>
          <ButtonLink href="/events/new">Reportar un evento</ButtonLink>
        </div>
      )}

      <Card>
        <CardBody>
          <EventFilters filters={filters} zones={zones} />
        </CardBody>
      </Card>

      {!page ? (
        <Alert tone="danger">No pudimos cargar los eventos. Intenta de nuevo más tarde.</Alert>
      ) : page.events.length === 0 ? (
        <EmptyState
          title={filtered ? "Ningún evento coincide con los filtros" : "Todavía no hay eventos"}
          description={
            filtered
              ? "Prueba con otra búsqueda, zona o estado."
              : "Cuando alguien reporte o publique un evento, aparecerá aquí."
          }
          action={
            filtered ? (
              <Link href="/events" className="text-sm font-semibold text-primary-strong hover:underline">
                Quitar filtros
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-sm text-ink-muted">
            {page.total} {page.total === 1 ? "evento" : "eventos"}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {page.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
          <EventPagination filters={{ ...filters, page: page.page }} lastPage={page.lastPage} />
        </>
      )}
    </div>
  );
}
