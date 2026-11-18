import type { Metadata } from "next";
import { Suspense } from "react";
import { EventList } from "@/features/events/presentation/components/event-list";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

/** Metadata para el catálogo de eventos */
export const metadata: Metadata = { title: "Eventos" };

/**
 * Componente EventsPage: Cartelera principal de eventos urbanos.
 *
 * - **¿Qué hace?**: Renderiza el encabezado general de eventos y el componente `EventList`, pasando los parámetros de búsqueda
 *   y filtros (`searchParams`: fechas, zona, tipo de evento) dentro de un límite `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta la URL (query params) con el componente de listado de eventos,
 *   el cual consulta el caso de uso `listEventsUseCase` a través de `eventContainer`.
 * - **¿Cuál es su importancia?**: Es el módulo central de descubrimiento cultural y social de CityPulse. Permite a los ciudadanos
 *   filtrar, explorar y encontrar actividades de interés en la ciudad de Cali.
 */
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
