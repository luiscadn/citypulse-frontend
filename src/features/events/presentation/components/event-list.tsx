import Link from "next/link";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { ButtonLink, Card, CardBody, EmptyState } from "@/shared/presentation/components";
import { eventContainer } from "../../di/event.container";
import { parseEventFilters } from "../../domain/rules/event-input";
import { canModerateEvents, canPublishOfficialEvents, canReportEvents } from "../../domain/rules/event-permissions";
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
    from: first(params.from),
    to: first(params.to),
    page: first(params.page),
  });

  const [user, zones, page] = await Promise.all([
    getCurrentUser(),
    zoneContainer.listZonesUseCase.execute().catch(() => []),
    // Si falla, lo muestra error.tsx
    eventContainer.listEventsUseCase.execute(filters),
  ]);

  const filtered =
    filters.zoneId !== null ||
    filters.status !== null ||
    filters.origin !== null ||
    filters.search !== null ||
    filters.from !== null ||
    filters.to !== null;

  return (
    <div className="flex flex-col gap-6">
      {canReportEvents(user) && (
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/events/new">Reportar un evento</ButtonLink>
          {canPublishOfficialEvents(user) && (
            <ButtonLink href="/events/official" variant="secondary">
              Publicar evento oficial
            </ButtonLink>
          )}
          {canModerateEvents(user) && (
            <ButtonLink href="/admin/moderation" variant="secondary">
              Reportes por revisar
            </ButtonLink>
          )}
        </div>
      )}

      <Card>
        <CardBody>
          <EventFilters filters={filters} zones={zones} />
        </CardBody>
      </Card>

      {page.events.length === 0 ? (
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
