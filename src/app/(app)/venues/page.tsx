import type { Metadata } from "next";
import { Suspense } from "react";
import { VenueList } from "@/features/venue/presentation/components/venue-list";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

/** Metadata para el catálogo de establecimientos y lugares */
export const metadata: Metadata = { title: "Lugares" };

/**
 * Componente VenuesPage: Directorio público de establecimientos urbanos verificados.
 *
 * - **¿Qué hace?**: Muestra el encabezado del módulo de lugares y renderiza el componente `VenueList`
 *   pasándole los parámetros de consulta (`searchParams`: paginación, filtros de verificación o zona) dentro de `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta con el caso de uso `listVenuesUseCase` de `venueContainer`,
 *   mostrando teatros, auditorios, restaurantes, museos y parques registrados.
 * - **¿Cuál es su importancia?**: Permite a la ciudadanía descubrir locaciones físicas verificadas donde se concentran
 *   actividades urbanas y eventos oficiales.
 */
export default function VenuesPage({ searchParams }: PageProps<"/venues">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Lugares"
        description="Teatros, museos y espacios donde se publican eventos oficiales."
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
        <VenueList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
