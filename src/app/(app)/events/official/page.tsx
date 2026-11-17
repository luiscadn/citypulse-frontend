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

/** Solo OWNER o ADMIN, y solo en sus propios lugares: sin lugares, explica cómo registrar uno. */
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
