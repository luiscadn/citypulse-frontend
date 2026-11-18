import { Suspense } from "react";
import { venueContainer } from "@/features/venue/di/venue.container";
import type { MappedVenue } from "@/features/venue/domain/entities/venue";
import { CityMap } from "@/features/venue/presentation/components/city-map/city-map";

/** Si el backend no responde, el mapa se muestra igual, sin puntos: no se cae el inicio. */
async function MapWithVenues() {
  let venues: MappedVenue[] = [];
  try {
    venues = await venueContainer.listMappedVenuesUseCase.execute();
  } catch {
    venues = [];
  }
  return <CityMap venues={venues} />;
}

/** Mapa 2D/3D de Cali con los lugares verificados, para el inicio. */
export function CityMapSection() {
  return (
    <section aria-label="Mapa de Cali">
      <Suspense fallback={<div className="skeleton h-[min(70dvh,36rem)] rounded-lg" aria-label="Cargando el mapa" />}>
        <MapWithVenues />
      </Suspense>
    </section>
  );
}
