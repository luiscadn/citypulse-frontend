/**
 * @file verify-venue.use-case.ts
 * @description Caso de uso para certificar administrativamente un Lugar (Venue).
 */

import type { Venue } from "../../domain/entities/venue";
import { assertValidVenueId } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Orquesta la verificación oficial de un lugar por parte de un Administrador (RF-2.4).
 *
 * - **¿Qué hace?**:
 *   Comprueba la validez del identificador del venue (`assertValidVenueId`) y solicita
 *   al repositorio el cambio de estado a verificado (`verify(id)`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Se invoca desde la Server Action `verifyVenueAction`
 *   y utiliza el puerto `VenueRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura el flujo de aprobación administrativa que distingue a los lugares confiables y oficiales
 *   dentro de la plataforma, protegiendo al ecosistema de información falsa o no verificada.
 */
export class VerifyVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta la verificación del lugar.
   *
   * - **¿Qué hace?**: Valida el identificador y llama al método `verify` del repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad `Venue` actualizada con `isVerified: true`.
   * - **¿Cuál es su importancia?**: Proporciona el mecanismo centralizado para avalar oficialmente locales en el sistema.
   */
  async execute(id: number): Promise<Venue> {
    assertValidVenueId(id);
    return this.venueRepository.verify(id);
  }
}
