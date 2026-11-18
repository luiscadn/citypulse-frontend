/**
 * @file create-venue.use-case.ts
 * @description Caso de uso para registrar un nuevo Lugar (Venue) en el sistema.
 */

import type { Venue, VenueDraft } from "../../domain/entities/venue";
import { normalizeVenueInput } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Orquesta la creación de un nuevo lugar físico por parte de un usuario con rol OWNER (RF-2.3).
 *
 * - **¿Qué hace?**:
 *   Toma un borrador crudo (`VenueDraft`), lo valida y normaliza mediante reglas puras de dominio (`normalizeVenueInput`),
 *   y delega al repositorio la persistencia del nuevo venue. El lugar nace automáticamente con estado pendiente (`isVerified: false`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es invocado por la Server Action `createVenueAction` y utiliza
 *   el puerto `VenueRepository` provisto por inyección de dependencias (`venueContainer`).
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que ningún lugar sea registrado sin haber pasado por el proceso formal de validación y limpieza,
 *   manteniendo la lógica de negocio desacoplada de los controladores web o frameworks.
 */
export class CreateVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta el caso de uso.
   *
   * - **¿Qué hace?**: Normaliza el borrador y solicita la creación en el repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad `Venue` recién creada con su nuevo ID generado por la base de datos.
   * - **¿Cuál es su importancia?**: Proporciona el punto de entrada transaccional para la operación de alta de lugares.
   */
  async execute(draft: VenueDraft): Promise<Venue> {
    return this.venueRepository.create(normalizeVenueInput(draft));
  }
}
