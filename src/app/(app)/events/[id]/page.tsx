import type { Metadata } from "next";
import { Suspense } from "react";
import { EventDetail } from "@/features/events/presentation/components/event-detail";
import { Container, Spinner } from "@/shared/presentation/components";

/** Metadata para la vista detallada de un evento */
export const metadata: Metadata = { title: "Evento" };

/**
 * Componente EventPage: Vista de detalle completo de un evento específico.
 *
 * - **¿Qué hace?**: Recibe el identificador dinámico desde los parámetros de ruta (`params: Promise<{ id: string }>`),
 *   transforma la promesa para extraer `id` numérico y renderiza el componente `EventDetail` dentro de un `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta la URL `/events/[id]` con el caso de uso `getEventUseCase`.
 *   Dentro de `EventDetail`, los usuarios pueden consultar la información del evento, ubicación en mapa,
 *   asistentes confirmados, amigos que asistirán y confirmar o cancelar su propia asistencia.
 * - **¿Cuál es su importancia?**: Integra múltiples módulos funcionales (Eventos, Zonas, Asistencia, Amigos, Mapas)
 *   en una sola experiencia interactiva de alto valor para el usuario.
 */
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
