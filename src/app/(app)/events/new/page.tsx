import type { Metadata } from "next";
import { Suspense } from "react";
import { EventForm } from "@/features/events/presentation/components/event-form";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { Card, CardBody, Container, PageHeader, Spinner } from "@/shared/presentation/components";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";

/** Metadata para la vista de reporte ciudadano de eventos */
export const metadata: Metadata = { title: "Reportar un evento" };

/**
 * Componente asíncrono ReportForm: Carga de dependencias y renderizado del formulario de eventos.
 *
 * - **¿Qué hace?**: Consulta de forma asíncrona en el servidor la lista de zonas disponibles (`zoneContainer.listZonesUseCase.execute()`)
 *   y renderiza el formulario `EventForm` pasándole las zonas para el selector geográfico.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta el bounded context de Zonas con la creación de Eventos.
 * - **¿Cuál es su importancia?**: Garantiza que el usuario solo pueda asociar un evento a una zona urbana válida y registrada en el sistema.
 */
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

/**
 * Componente NewEventPage: Página para reportar o registrar un nuevo evento.
 *
 * - **¿Qué hace?**: Provee migas de pan (`Breadcrumbs`), título y descripción de la acción, y envuelve la carga
 *   del formulario (`ReportForm`) en `<Suspense>` con un `Spinner` centrado.
 * - **¿Cómo interactúa con el sistema en general?**: Permite a cualquier usuario autenticado reportar actividades
 *   urbanas para su posterior moderación por administradores (`EventStatus.REPORTADO`).
 * - **¿Cuál es su importancia?**: Fomenta la participación comunitaria ("crowdsourcing") en la recopilación
 *   de eventos en la ciudad, manteniendo una UI limpia y guiada.
 */
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
