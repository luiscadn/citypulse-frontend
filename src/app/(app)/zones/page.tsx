import type { Metadata } from "next";
import { Suspense } from "react";
import { ZoneList } from "@/features/zone/presentation/components/zone-list";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

/** Metadata para el catálogo de zonas urbanas */
export const metadata: Metadata = { title: "Zonas" };

/**
 * Componente ZonesPage: Directorio y mapa sectorial de zonas de la ciudad.
 *
 * - **¿Qué hace?**: Renderiza la cabecera de la sección de zonas y monta el componente `ZoneList` dentro de `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: `ZoneList` consulta `zoneContainer.listZonesUseCase`,
 *   mostrando comunas, barrios y sectores geográficos disponibles, junto a formularios de creación rápida si el usuario es `ADMIN`.
 * - **¿Cuál es su importancia?**: Es la espina dorsal geográfica de CityPulse; todas las entidades (lugares, eventos)
 *   se agrupan y filtran a partir de estas zonas urbanas.
 */
export default function ZonesPage() {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Zonas"
        description="Barrios y sectores de la ciudad donde ocurren los eventos y están los lugares."
        className="pb-0"
      />
      {/* Los datos dependen de la petición: van en Suspense para no bloquear el resto de la página */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <ZoneList />
      </Suspense>
    </Container>
  );
}
