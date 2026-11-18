/**
 * @file list-venues.use-case.ts
 * @description Caso de uso para obtener el catálogo público paginado y filtrado de Lugares.
 */

import type { VenueFilters, VenuePage } from "../../domain/entities/venue";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Consulta el listado público de lugares con soporte para filtros de zona, estado de verificación y paginación.
 *
 * - **¿Qué hace?**:
 *   Transmite los filtros limpios de dominio (`VenueFilters`) hacia `VenueRepository.list`
 *   para obtener una página de lugares junto con sus totales.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es consumido por el Server Component `VenueList`
 *   en la página pública `/venues`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite la exploración pública eficiente y paginada del directorio de teatros, museos y auditorios,
 *   posibilitando búsquedas segmentadas por zonas de la ciudad y estatus de confianza.
 */
export class ListVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta la consulta paginada de lugares.
   *
   * - **¿Qué hace?**: Delega al repositorio la búsqueda con los filtros dados.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna una estructura `VenuePage` con la lista de venues y metadatos de paginación.
   * - **¿Cuál es su importancia?**: Ofrece una vía tipada y desacoplada para la renderización de la cartelera de lugares.
   */
  execute(filters: VenueFilters): Promise<VenuePage> {
    return this.venueRepository.list(filters);
  }
}
