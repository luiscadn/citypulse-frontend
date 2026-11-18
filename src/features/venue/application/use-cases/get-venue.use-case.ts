/**
 * @file get-venue.use-case.ts
 * @description Caso de uso para consultar la información detallada de un Lugar por su ID.
 */

import type { Venue } from "../../domain/entities/venue";
import { VenueNotFoundError } from "../../domain/errors/venue-errors";
import { isValidVenueId } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Consulta y recupera un lugar a partir de su identificador numérico.
 *
 * - **¿Qué hace?**:
 *   Evalúa si el ID suministrado es un entero positivo válido; si no lo es, lanza inmediatamente
 *   `VenueNotFoundError`. Si el formato es correcto, delega la búsqueda a `VenueRepository.findById`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es invocado por el Server Component `VenueDetail`
 *   para renderizar la ficha completa del lugar y por vistas que requieran consultar el recurso.
 *
 * - **¿Cuál es su importancia?**:
 *   Maneja de forma homogénea los IDs inexistentes o mal formados, evitando llamadas de red inútiles
 *   al servidor remoto y facilitando el direccionamiento hacia la página 404 de Next.js.
 */
export class GetVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta la consulta de un lugar por ID.
   *
   * - **¿Qué hace?**: Comprueba el ID y solicita la entidad al repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad de dominio `Venue` o lanza `VenueNotFoundError`.
   * - **¿Cuál es su importancia?**: Provee una recuperación segura y validada del detalle de un local.
   */
  async execute(id: number): Promise<Venue> {
    if (!isValidVenueId(id)) throw new VenueNotFoundError();
    return this.venueRepository.findById(id);
  }
}
