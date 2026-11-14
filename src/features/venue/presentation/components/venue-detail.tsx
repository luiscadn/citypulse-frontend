import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { googleMapsSearchUrl } from "@/features/maps/domain/rules/maps-links";
import { Alert, Card, CardBody, CardHeader, PageHeader } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { venueContainer } from "../../di/venue.container";
import type { Venue } from "../../domain/entities/venue";
import { VenueNotFoundError } from "../../domain/errors/venue-errors";
import { canManageVenue, canVerifyVenues } from "../../domain/rules/venue-permissions";
import { DeleteVenueButton, VerifyVenueButton } from "./venue-admin-buttons";
import { VenueForm } from "./venue-form";
import { VenueStatusBadge } from "./venue-status-badge";

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
    return <Alert tone="danger">No pudimos cargar el lugar. Intenta de nuevo más tarde.</Alert>;
  }

  const user = await getCurrentUser();
  const canManage = canManageVenue(user, venue);
  const canVerify = canVerifyVenues(user) && !venue.isVerified;
  // Las zonas solo hacen falta para el formulario de edición
  const zones = canManage ? await zoneContainer.listZonesUseCase.execute().catch(() => []) : [];

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href={`/zones/${venue.zone.id}`} className="hover:underline">
            {venue.zone.name}
          </Link>
        }
        title={venue.name}
        description={venue.description ?? undefined}
        actions={<VenueStatusBadge isVerified={venue.isVerified} />}
        className="pb-0"
      />

      <Card>
        <CardBody>
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-ink-muted">Dirección</dt>
              <dd className="text-ink">{venue.address ?? "Sin dirección"}</dd>
              <dd>
                <a
                  href={googleMapsSearchUrl(venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary-strong hover:underline"
                >
                  Ver en Google Maps ↗
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">Dueño</dt>
              <dd className="text-ink">
                {venue.owner.fullName} <span className="text-ink-muted">@{venue.owner.username}</span>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">Registrado</dt>
              <dd className="text-ink">{formatDateTime(venue.createdAt)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {canVerify && (
        <Card>
          <CardHeader
            title="Pendiente de verificación"
            description="Revisa que el lugar exista y sea de quien lo registró antes de verificarlo."
          />
          <CardBody>
            <VerifyVenueButton venueId={venue.id} />
          </CardBody>
        </Card>
      )}

      {canManage && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Editar lugar" />
            <CardBody>
              <VenueForm
                venue={venue}
                zones={zones}
                warnVerification={venue.isVerified && !canVerifyVenues(user)}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Eliminar lugar" description="Sus eventos se conservan, pero quedan sin lugar." />
            <CardBody>
              <DeleteVenueButton venueId={venue.id} venueName={venue.name} />
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
