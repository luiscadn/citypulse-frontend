/**
 * @file event-list.tsx
 * @description Server Component para la cartelera general de Eventos.
 * Conecta los filtros de la URL, efectúa consultas paralelas en el servidor y renderiza la cuadrícula de eventos.
 */

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

/** Función auxiliar para extraer el primer valor en parámetros de consulta. */
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Componente de servidor para el listado general de eventos.
 *
 * - **¿Qué hace?**:
 *   Parsea los parámetros de búsqueda de la URL (`searchParams`), consulta en paralelo (`Promise.all`) la sesión
 *   del usuario, el catálogo de zonas y la página de eventos correspondiente (`listEventsUseCase`), y renderiza:
 *   el botón de acción "Reportar un evento" si el usuario está autenticado, la tarjeta con el formulario de filtros,
 *   el conteo total de eventos encontrados, la cuadrícula de tarjetas (`EventCard`) o el estado vacío contextual,
 *   y la paginación (`EventPagination`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el componente principal de la ruta `/events`. Comunica los módulos de `events`, `zone` y `auth`.
 *
 * - **¿Cuál es su importancia?**:
 *   Provee el punto de encuentro principal para descubrir la agenda cultural de la ciudad,
 *   optimizando el rendimiento y SEO mediante Server Components.
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
          <ul className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
