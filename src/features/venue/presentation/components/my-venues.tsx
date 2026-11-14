import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Alert, Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { venueContainer } from "../../di/venue.container";
import { canRegisterVenues } from "../../domain/rules/venue-permissions";
import { VenueCard } from "./venue-card";
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
        <Alert tone="danger">No pudimos cargar tus lugares. Intenta de nuevo más tarde.</Alert>
      ) : venues.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Todavía no tienes lugares"
          description="Registra el primero con el formulario. Un administrador lo verificará."
        />
      )}

      <Card>
        <CardHeader title="Registrar un lugar" description="Nace pendiente hasta que un administrador lo verifique." />
        <CardBody>
          <VenueForm zones={zones} />
        </CardBody>
      </Card>
    </div>
  );
}
