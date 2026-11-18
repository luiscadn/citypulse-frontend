import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { canPublishOfficialEvents } from "@/features/events/domain/rules/event-permissions";
import { OfficialEventForm } from "@/features/events/presentation/components/official-event-form";
import { venueContainer } from "@/features/venue/di/venue.container";
import { ButtonLink, Card, CardBody, Container, EmptyState, PageHeader, Spinner } from "@/shared/presentation/components";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";

export const metadata: Metadata = { title: "Publicar un evento oficial" };

/**
 * Server Component asíncrono para renderizar el formulario de publicación de eventos oficiales.
 *
 * - **¿Qué hace?**: Verifica que el usuario tenga privilegios (`canPublishOfficialEvents`); si no los tiene,
 *   responde con `notFound()`. Obtiene los recintos del usuario (`listMyVenuesUseCase.execute()`).
 *   Si no tiene recintos, muestra un `EmptyState` invitándolo a registrar uno; de lo contrario, muestra `OfficialEventForm`.
 * - **¿Cómo interactúa con el sistema en general?**: Orquesta los casos de uso de recintos y la autorización de eventos.
 * - **¿Cuál es su importancia?**: Garantiza que no se puedan publicar eventos oficiales en el vacío, requiriendo
 *   previamente un lugar físico registrado y validado.
 */
async function PublishForm() {
  if (!canPublishOfficialEvents(await getCurrentUser())) notFound();
  // Si falla, lo muestra error.tsx
  const venues = await venueContainer.listMyVenuesUseCase.execute();

  if (venues.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes lugares"
        description="Un evento oficial se publica en uno de tus lugares. Registra uno primero."
        action={<ButtonLink href="/venues/mine">Registrar un lugar</ButtonLink>}
      />
    );
  }

  return (
    <Card>
      <CardBody>
        <OfficialEventForm venues={venues} />
      </CardBody>
    </Card>
  );
}

/**
 * Página para Publicar Eventos Oficiales Institucionales (`/events/official`)
 *
 * - **¿Qué hace?**: Renderiza el encabezado con migas de pan (`Breadcrumbs`), el título y la descripción,
 *   y monta `PublishForm` dentro de un `<Suspense>` con un spinner de carga.
 * - **¿Cómo interactúa con el sistema en general?**: Es el punto de entrada para organizadores y administradores
 *   al registrar eventos en la cartelera oficial.
 * - **¿Cuál es su importancia?**: Estructura la vista siguiendo las pautas de accesibilidad y diseño del sistema,
 *   desacoplando el shell de la página del fetching asíncrono de lugares mediante streaming.
 */
export default function OfficialEventPage() {
  return (
    <Container className="flex max-w-2xl flex-col gap-6 pb-12">
      <Breadcrumbs items={[{ label: "Eventos", href: "/events" }, { label: "Publicar un evento oficial" }]} />
      <PageHeader
        title="Publicar un evento oficial"
        description="Los eventos oficiales se publican confirmados, sin pasar por moderación."
        className="pt-2 pb-0"
      />
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <PublishForm />
      </Suspense>
    </Container>
  );
}
