/**
 * @file update-venue.use-case.ts
 * @description Caso de uso para actualizar la información de un Lugar (Venue) existente.
 */

import type { Venue, VenueDraft } from "../../domain/entities/venue";
import { assertValidVenueId, normalizeVenueInput } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Orquesta la actualización de los datos de un lugar por parte de su OWNER o de un ADMIN (RF-2.5).
 *
 * - **¿Qué hace?**:
 *   Verifica la validez del ID (`assertValidVenueId`), sanea y valida el borrador de entrada (`normalizeVenueInput`),
 *   y envía los cambios al repositorio. Si un usuario no administrador altera datos críticos de un lugar verificado,
 *   el backend revocará automáticamente la verificación devolviéndolo a estado pendiente.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es invocado por la Server Action `updateVenueAction`
 *   y utiliza el puerto `VenueRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que toda modificación cumpla con los límites de tamaño y reglas de unicidad,
 *   manteniendo la consistencia del catálogo y la trazabilidad del estado de verificación.
 */
export class UpdateVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta la actualización del lugar.
   *
   * - **¿Qué hace?**: Valida ID y borrador, y delega la actualización al repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad de dominio `Venue` actualizada con su nuevo estado de verificación.
   * - **¿Cuál es su importancia?**: Centraliza la lógica de mutación de locales garantizando la aplicación de reglas de negocio previas.
   */
  async execute(id: number, draft: VenueDraft): Promise<Venue> {
    assertValidVenueId(id);
    return this.venueRepository.update(id, normalizeVenueInput(draft));
  }
}
