/**
 * @file delete-venue.use-case.ts
 * @description Caso de uso para eliminar un Lugar (Venue) existente del sistema.
 */

import { assertValidVenueId } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Orquesta la eliminación de un lugar por parte de su OWNER o de un ADMIN (RF-2.5).
 *
 * - **¿Qué hace?**:
 *   Verifica que el identificador sea formalmente válido (`assertValidVenueId`) y solicita
 *   al repositorio la remoción definitiva del registro. Los eventos previamente asociados al lugar
 *   se conservan en el backend desvinculando la referencia física (quedan sin lugar).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Se invoca desde la Server Action `deleteVenueAction`
 *   y utiliza el puerto `VenueRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura un borrado limpio previa validación de parámetros, delegando la autorización estricta al backend
 *   y previniendo la eliminación en cascada indeseada de eventos históricos.
 */
export class DeleteVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta la eliminación del lugar indicado.
   *
   * - **¿Qué hace?**: Valida el identificador numérico y llama al método `remove` del repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Lanza `InvalidVenueError`, `VenueNotFoundError` o `VenueForbiddenError` si algo falla.
   * - **¿Cuál es su importancia?**: Centraliza la operación de baja protegiendo la integridad del catálogo.
   */
  async execute(id: number): Promise<void> {
    assertValidVenueId(id);
    await this.venueRepository.remove(id);
  }
}
