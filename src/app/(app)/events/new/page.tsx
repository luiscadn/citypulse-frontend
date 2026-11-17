import type { Metadata } from "next";
import { Suspense } from "react";
import { EventForm } from "@/features/events/presentation/components/event-form";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Card, CardBody, Container, PageHeader, Spinner } from "@/shared/presentation/components";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";

export const metadata: Metadata = { title: "Reportar un evento" };

/** Las zonas vienen del backend con la sesión: se leen dentro de <Suspense>. */
async function ReportForm() {
  // Si falla, lo muestra error.tsx
  const zones = await zoneContainer.listZonesUseCase.execute();

  return (
    <Card>
      <CardBody>
        <EventForm zones={zones} />
      </CardBody>
    </Card>
  );
}

export default function NewEventPage() {
  return (
    <Container className="flex max-w-2xl flex-col gap-6 pb-12">
      <Breadcrumbs items={[{ label: "Eventos", href: "/events" }, { label: "Reportar un evento" }]} />
      <PageHeader
        title="Reportar un evento"
        description="Cuéntanos de un evento que viste o conoces. Un administrador lo revisará con las evidencias que adjuntes."
        className="pt-2 pb-0"
      />
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <ReportForm />
      </Suspense>
    </Container>
  );
}
