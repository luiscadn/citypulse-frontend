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

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Listado público de lugares con filtros y paginación.
 * Lee searchParams y la sesión: con Cache Components debe ir dentro de <Suspense>.
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
