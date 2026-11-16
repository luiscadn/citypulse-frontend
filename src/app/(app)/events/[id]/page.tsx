import type { Metadata } from "next";
import { Suspense } from "react";
import { EventDetail } from "@/features/events/presentation/components/event-detail";
import { Container, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Evento" };

export default function EventPage({ params }: PageProps<"/events/[id]">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      {/* El ID llega como promesa y el evento depende de la petición: todo va en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <EventDetail eventId={params.then((p) => p.id)} />
      </Suspense>
    </Container>
  );
}
