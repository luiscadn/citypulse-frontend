import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { googleMapsSearchUrl } from "@/features/maps/domain/rules/maps-links";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Alert, Card, CardBody, CardFooter, CardHeader, PageHeader } from "@/shared/presentation/components";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";
import { ExternalLinkIcon } from "@/shared/presentation/components/icons";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { venueContainer } from "../../di/venue.container";
import type { Venue } from "../../domain/entities/venue";
import { VenueNotFoundError } from "../../domain/errors/venue-errors";
import { canManageVenue, canVerifyVenues } from "../../domain/rules/venue-permissions";
import { DeleteVenueButton, VerifyVenueButton } from "./venue-admin-buttons";
import { VenueForm } from "./venue-form";
import { VenueStatusBadge } from "./venue-status-badge";

const linkClass =
  "rounded-sm font-semibold text-primary-strong hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring";

/**
 * Detalle de un lugar. A su dueño y al ADMIN les muestra cómo editarlo o borrarlo;
 * al ADMIN, además, cómo verificarlo si está pendiente.
 * Recibe el ID como promesa (params de la ruta) y lee la sesión: va dentro de <Suspense>.
 */
export async function VenueDetail({ venueId }: { venueId: Promise<string> }) {
  const id = Number(await venueId);

  let venue: Venue;
  try {
    venue = await venueContainer.getVenueUseCase.execute(id);
  } catch (error) {
    if (error instanceof VenueNotFoundError) notFound();
    return <Alert tone="danger">No pudimos cargar el lugar. Recarga la página en un momento.</Alert>;
  }

  const user = await getCurrentUser();
  const canManage = canManageVenue(user, venue);
  const isAdmin = canVerifyVenues(user);
  // Las zonas solo hacen falta para el formulario de edición
  const zones = canManage ? await zoneContainer.listZonesUseCase.execute().catch(() => []) : [];

  return (
    <>
      <Breadcrumbs items={[{ label: "Lugares", href: "/venues" }, { label: venue.name }]} />
      <PageHeader
        title={venue.name}
        description={venue.description ?? undefined}
        actions={<VenueStatusBadge isVerified={venue.isVerified} />}
        className="pt-2 pb-0"
      />

      {/* El ADMIN ve primero lo que tiene pendiente por hacer */}
      {isAdmin && !venue.isVerified && (
        <Alert tone="warning" title="Pendiente de verificación">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Revisa que el lugar exista y sea de quien lo registró antes de verificarlo.</span>
            <VerifyVenueButton venueId={venue.id} />
          </div>
        </Alert>
      )}

      <dl className="grid gap-x-8 gap-y-5 rounded-lg border border-line bg-surface px-5 py-4 text-sm sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-ink-muted">Dirección</dt>
          <dd className="font-medium break-words text-ink">{venue.address ?? "Sin dirección"}</dd>
          <dd className="mt-1">
            <a
              href={googleMapsSearchUrl(venue)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 ${linkClass}`}
            >
              Ver en Google Maps
              <ExternalLinkIcon className="size-3.5" />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </a>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-ink-muted">Zona</dt>
          <dd>
            <Link href={`/zones/${venue.zone.id}`} className={linkClass}>
              {venue.zone.name}
            </Link>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-ink-muted">Dueño</dt>
          <dd className="truncate font-medium text-ink">
            {venue.owner.fullName} <span className="font-normal text-ink-muted">@{venue.owner.username}</span>
          </dd>
          <dd className="text-ink-muted">Registrado el {formatDateTime(venue.createdAt)}</dd>
        </div>
      </dl>

      {canManage && (
        <Card className="max-w-2xl">
          <CardHeader title="Editar lugar" />
          <CardBody>
            <VenueForm venue={venue} zones={zones} warnVerification={venue.isVerified && !isAdmin} />
          </CardBody>
          {/* Lo destructivo va aparte y al final, para no confundirlo con guardar */}
          <CardFooter className="flex-wrap justify-between gap-4">
            <p className="max-w-sm text-sm text-ink-muted">
              Eliminar el lugar no se puede deshacer. Sus eventos se conservan, pero quedan sin lugar.
            </p>
            <DeleteVenueButton venueId={venue.id} venueName={venue.name} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
