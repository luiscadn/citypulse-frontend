import { Suspense } from "react";
import { venueContainer } from "@/features/venue/di/venue.container";
import type { MappedVenue } from "@/features/venue/domain/entities/venue";
import { CityMap } from "@/features/venue/presentation/components/city-map/city-map";

/**
 * Server Component asíncrono que obtiene los lugares mapeados y renderiza el mapa.
 *
 * - **¿Qué hace?**: Invoca `venueContainer.listMappedVenuesUseCase.execute()` para obtener recintos verificados
 *   con coordenadas geográficas válidas. Si la petición falla o la API no responde, captura el error
 *   y pasa un arreglo vacío en lugar de romper el renderizado.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta el caso de uso del contenedor de dependencias
 *   con el Client Component interactivo `CityMap`.
 * - **¿Cuál es su importancia?**: Implementa tolerancia a fallos (Graceful Degradation): la portada principal
 *   sigue cargando el mapa 3D de Cali aunque el backend de recintos experimente intermitencias temporales.
 */
async function MapWithVenues() {
  let venues: MappedVenue[] = [];
  try {
    venues = await venueContainer.listMappedVenuesUseCase.execute();
  } catch {
    venues = [];
  }
  return <CityMap venues={venues} />;
}

/**
 * Sección de portada que presenta el Mapa 3D interactivo de Santiago de Cali.
 *
 * - **¿Qué hace?**: Envuelve la carga asíncrona de `MapWithVenues` dentro de un límite de `<Suspense>`,
 *   mostrando un esqueleto (`skeleton`) mientras se recuperan las coordenadas y se inicializa el componente.
 * - **¿Cómo interactúa con el sistema en general?**: Se incrusta directamente en la página de inicio (`/`)
 *   como elemento visual principal de bienvenida para los usuarios.
 * - **¿Cuál es su importancia?**: Mejora el rendimiento percibido y el First Contentful Paint (FCP)
 *   haciendo streaming de la sección del mapa sin bloquear el resto de la página inicial.
 */
export function CityMapSection() {
  return (
    <section aria-label="Mapa de Cali">
      <Suspense fallback={<div className="skeleton h-[min(70dvh,36rem)] rounded-lg" aria-label="Cargando el mapa" />}>
        <MapWithVenues />
      </Suspense>
    </section>
  );
}
