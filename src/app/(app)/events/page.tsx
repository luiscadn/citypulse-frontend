import type { Metadata } from "next";
import { Suspense } from "react";
import { EventList } from "@/features/events/presentation/components/event-list";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Eventos" };

export default function EventsPage({ searchParams }: PageProps<"/events">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Eventos"
        description="Ferias, conciertos y mercados de Cali: reportados por la gente o publicados por sus lugares."
        className="pb-0"
      />
      {/* Los filtros y la sesión dependen de la petición: van en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <EventList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
