import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { EventForm } from "@/features/events/presentation/components/event-form";
import { Alert, Card, CardBody, Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Reportar un evento" };

/** Las zonas vienen del backend con la sesión: se leen dentro de <Suspense>. */
async function ReportForm() {
  const zones = await zoneContainer.listZonesUseCase.execute().catch(() => null);
  if (!zones) return <Alert tone="danger">No pudimos cargar las zonas. Intenta de nuevo más tarde.</Alert>;

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
      <Link href="/events" className="pt-6 text-sm font-semibold text-primary-strong hover:underline">
        ← Todos los eventos
      </Link>
      <PageHeader
        title="Reportar un evento"
        description="Cuéntanos de un evento que viste o conoces. Un administrador lo revisará con las evidencias que adjuntes."
        className="pb-0"
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
