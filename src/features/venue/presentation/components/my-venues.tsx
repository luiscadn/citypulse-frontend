/**
 * @file my-venues.tsx
 * @description Server Component que muestra la lista de lugares gestionados por el usuario autenticado (OWNER)
 * y el formulario lateral para registrar nuevos establecimientos.
 */

import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Alert, Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { venueContainer } from "../../di/venue.container";
import { canRegisterVenues } from "../../domain/rules/venue-permissions";
import { VenueRow, VenueRows } from "./venue-row";
import { VenueForm } from "./venue-form";

/**
 * Componente de servidor para la gestión de "Mis Lugares".
 *
 * - **¿Qué hace?**:
 *   Evalúa si el usuario en sesión tiene permisos de OWNER; si no, muestra una alerta informativa.
 *   Si tiene permiso, consulta concurrentemente en paralelo (`Promise.all`) sus propios lugares
 *   (`listMyVenuesUseCase`) y las zonas disponibles (`listZonesUseCase`), renderizando la lista de lugares
 *   a la izquierda y el formulario de alta fijado a la derecha en pantallas grandes.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Renderizado en la ruta `/venues/mine` dentro de un `<Suspense>` debido al acceso a cookies de sesión.
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza el panel de control del propietario de recintos culturales/deportivos, combinando
 *   la visualización del inventario propio con la acción inmediata de creación en un diseño ergonómico.
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
    venueContainer.listMyVenuesUseCase.execute(),
    zoneContainer.listZonesUseCase.execute().catch(() => []),
  ]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      {venues.length > 0 ? (
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
