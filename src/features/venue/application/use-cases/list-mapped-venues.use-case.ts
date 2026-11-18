import type { MappedVenue } from "../../domain/entities/venue";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Caso de Uso: Listar Lugares Verificados con Ubicación para el Mapa de la Ciudad
 *
 * - **¿Qué hace?**: Solicita al repositorio la colección de lugares (`Venue`) que cuentan con coordenadas
 *   geográficas válidas (`latitude` y `longitude` no nulas) y están formalmente verificados por un administrador.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación del módulo `venue`.
 *   Consumido por el Server Component `MapWithVenues` en la sección de portada `CityMapSection`.
 * - **¿Cuál es su importancia?**: Filtra y entrega únicamente los recintos aptos para ser proyectados como marcadores
 *   interactivos sobre el mapa 3D de Cali.
 */
export class ListMappedVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  execute(): Promise<MappedVenue[]> {
    return this.venueRepository.listMapped();
  }
}
