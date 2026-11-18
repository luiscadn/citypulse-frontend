import type { Metadata } from "next";
import { Suspense } from "react";
import { ZoneDetail } from "@/features/zone/presentation/components/zone-detail";
import { Container, Spinner } from "@/shared/presentation/components";

/** Metadata para el detalle de una zona */
export const metadata: Metadata = { title: "Zona" };

/**
 * Componente ZonePage: Vista de detalle y edición de una zona urbana.
 *
 * - **¿Qué hace?**: Obtiene el identificador `id` desde los parámetros dinámicos de ruta de forma asíncrona
 *   y renderiza `ZoneDetail` dentro de un límite `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: `ZoneDetail` consulta el caso de uso `getZoneUseCase`,
 *   mostrando nombre, descripción, zona padre si aplica, y los controles de edición o eliminación para administradores.
 * - **¿Cuál es su importancia?**: Permite inspeccionar y administrar la jerarquía territorial de la ciudad en la aplicación.
 */
export default function ZonePage({ params }: PageProps<"/zones/[id]">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      {/* El ID llega como promesa y la zona depende de la petición: todo va en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <ZoneDetail zoneId={params.then((p) => p.id)} />
      </Suspense>
    </Container>
  );
}
