import type { Metadata } from "next";
import { Suspense } from "react";
import { VenueDetail } from "@/features/venue/presentation/components/venue-detail";
import { Container, Spinner } from "@/shared/presentation/components";

/** Metadata para el detalle de un lugar */
export const metadata: Metadata = { title: "Lugar" };

/**
 * Componente VenuePage: Vista detallada de un lugar o establecimiento individual.
 *
 * - **¿Qué hace?**: Extrae el parámetro dinámico de ruta `id` de forma asíncrona (`params.then((p) => p.id)`)
 *   y renderiza el componente `VenueDetail` dentro de un límite `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta con el caso de uso `getVenueUseCase` en `venueContainer`.
 *   Permite visualizar la dirección física, estado de verificación, zona de pertenencia, acciones de administración
 *   (verificar, eliminar) y enlace a mapas geográficos.
 * - **¿Cuál es su importancia?**: Ofrece una ficha técnica integral de cada lugar para usuarios y administradores,
 *   garantizando carga diferida fluida sin congelar la interfaz.
 */
export default function VenuePage({ params }: PageProps<"/venues/[id]">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      {/* El ID llega como promesa y el lugar depende de la petición: todo va en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <VenueDetail venueId={params.then((p) => p.id)} />
      </Suspense>
    </Container>
  );
}
