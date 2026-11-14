import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Alert, Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { venueContainer } from "../../di/venue.container";
import { canRegisterVenues } from "../../domain/rules/venue-permissions";
import { VenueRow, VenueRows } from "./venue-row";
import { VenueForm } from "./venue-form";

/**
 * Lugares del OWNER de la sesión (incluidos los pendientes) y el formulario para registrar uno.
 * Lee la cookie de sesión: con Cache Components debe ir dentro de <Suspense>.
 */
export async function MyVenues() {
  if (!canRegisterVenues(await getCurrentUser())) {
    return (
      <Alert tone="info">
        Esta sección es para dueños de lugares. Si administras un lugar, pídele a un administrador el rol
        OWNER.
      </Alert>
    );
  }

  const [venues, zones] = await Promise.all([
    venueContainer.listMyVenuesUseCase.execute().catch(() => null),
    zoneContainer.listZonesUseCase.execute().catch(() => []),
  ]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      {!venues ? (
        <Alert tone="danger">No pudimos cargar tus lugares. Recarga la página en un momento.</Alert>
      ) : venues.length > 0 ? (
        <VenueRows>
          {venues.map((venue) => (
            <VenueRow key={venue.id} venue={venue} />
          ))}
        </VenueRows>
      ) : (
        <EmptyState
          title="Todavía no tienes lugares"
          description="Registra el primero con el formulario. Un administrador lo verificará."
        />
      )}

      <Card className="lg:sticky lg:top-24">
        <CardHeader title="Registrar un lugar" description="Nace pendiente hasta que un administrador lo verifique." />
        <CardBody>
          <VenueForm zones={zones} />
        </CardBody>
      </Card>
    </div>
  );
}
