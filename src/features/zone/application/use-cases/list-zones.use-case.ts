import type { Zone } from "../../domain/entities/zone";
import type { ZoneRepository } from "../repositories/zone-repository";

/**
 * Caso de Uso: ListZonesUseCase
 *
 * - **¿Qué hace?**: Obtiene todas las zonas registradas a través del repositorio y las ordena alfabéticamente
 *   por nombre (`localeCompare` en español) antes de entregarlas.
 * - **¿Cómo interactúa con el sistema en general?**: Es ampliamente consumido en Server Components:
 *   `ZoneList` para el catálogo general, `EventForm` para el selector de zona en eventos,
 *   y filtros de búsqueda en `VenueList`.
 * - **¿Cuál es su importancia?**: Asegura una presentación consistente y ordenada para los usuarios finales
 *   en todos los menús desplegables y vistas jerárquicas del sistema.
 */
export class ListZonesUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  /**
   * Ejecuta la consulta y ordenamiento de todas las zonas.
   *
   * @returns Arreglo de entidades `Zone` ordenadas alfabéticamente por nombre.
   */
  async execute(): Promise<Zone[]> {
    const zones = await this.zoneRepository.list();
    return [...zones].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }
}
