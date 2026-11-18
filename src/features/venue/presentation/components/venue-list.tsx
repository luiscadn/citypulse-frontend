/**
 * @file venue-list.tsx
 * @description Server Component para la vista del catálogo público de Lugares (Venues).
 * Resuelve parámetros de consulta, carga datos en paralelo y organiza filtros, listas y paginación.
 */

import Link from "next/link";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { ButtonLink, Card, CardBody, EmptyState } from "@/shared/presentation/components";
import { venueContainer } from "../../di/venue.container";
import { parseVenueFilters } from "../../domain/rules/venue-input";
import { canRegisterVenues, canVerifyVenues } from "../../domain/rules/venue-permissions";
import { VenueRow, VenueRows } from "./venue-row";
import { VenueFilters } from "./venue-filters";
import { VenuePagination } from "./venue-pagination";

/** Función auxiliar para extraer el primer valor si el parámetro viene como array. */
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Componente de servidor para el listado general de lugares con paginación y filtros.
 *
 * - **¿Qué hace?**:
 *   Parsea los query params recibidos en `searchParams`, recupera en paralelo (`Promise.all`) la sesión
 *   del usuario, la lista de zonas y la página de venues filtrada (`listVenuesUseCase`), y renderiza:
 *   accesos directos a "Mis lugares" (si es OWNER) y "Lugares por verificar" (si es ADMIN),
 *   la tarjeta de filtros interactiva, el contador total, la lista de filas (`VenueRow`) o estado vacío,
 *   y el control de paginación (`VenuePagination`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el componente principal de la página `/venues`. Conecta los casos de uso de `venue` y `zone`
 *   con la autenticación y la URL del navegador.
 *
 * - **¿Cuál es su importancia?**:
 *   Provee el punto de entrada para explorar toda la oferta física de la ciudad, ofreciendo una experiencia
 *   rápida y optimizada gracias a la renderización en el servidor (RSC).
 */
export async function VenueList({ searchParams }: { searchParams: PageProps<"/venues">["searchParams"] }) {
  const params = await searchParams;
  const filters = parseVenueFilters({
    zoneId: first(params.zoneId),
    isVerified: first(params.isVerified),
    page: first(params.page),
  });

  const [user, zones, page] = await Promise.all([
    getCurrentUser(),
    zoneContainer.listZonesUseCase.execute().catch(() => []),
    venueContainer.listVenuesUseCase.execute(filters),
  ]);

  const isOwner = canRegisterVenues(user);
  const isAdmin = canVerifyVenues(user);
  const filtered = filters.zoneId !== null || filters.isVerified !== null;

  return (
    <div className="flex flex-col gap-6">
      {(isOwner || isAdmin) && (
        <div className="flex flex-wrap gap-2">
          {isOwner && <ButtonLink href="/venues/mine">Mis lugares</ButtonLink>}
          {isAdmin && (
            <ButtonLink href="/venues?isVerified=false" variant="secondary">
              Lugares por verificar
            </ButtonLink>
          )}
        </div>
      )}

      <Card>
        <CardBody>
          <VenueFilters filters={filters} zones={zones} />
        </CardBody>
      </Card>

      {page.venues.length === 0 ? (
        <EmptyState
          title={filtered ? "Ningún lugar coincide con los filtros" : "Todavía no hay lugares"}
          description={
            filtered
              ? "Prueba con otra zona o con otro estado."
              : "Cuando un dueño registre su lugar, aparecerá aquí."
          }
          action={
            filtered ? (
              <Link href="/venues" className="text-sm font-semibold text-primary-strong hover:underline">
                Quitar filtros
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-sm text-ink-muted">
            <span className="tabular-nums">{page.total}</span> {page.total === 1 ? "lugar" : "lugares"}
            {filters.isVerified === false && " por verificar"}
          </p>
          <VenueRows>
            {page.venues.map((venue) => (
              <VenueRow key={venue.id} venue={venue} />
            ))}
          </VenueRows>
          <VenuePagination filters={{ ...filters, page: page.page }} lastPage={page.lastPage} />
        </>
      )}
    </div>
  );
}
