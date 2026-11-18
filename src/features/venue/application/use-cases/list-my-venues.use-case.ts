/**
 * @file list-my-venues.use-case.ts
 * @description Caso de uso para obtener todos los Lugares gestionados por el usuario autenticado (OWNER).
 */

import type { Venue } from "../../domain/entities/venue";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Consulta la colección de lugares creados y administrados por el OWNER actual.
 *
 * - **¿Qué hace?**:
 *   Invoca el método `listMine` de `VenueRepository` para obtener los lugares del usuario de la sesión,
 *   incluyendo tanto aquellos ya verificados como los que aún se encuentran pendientes de revisión.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Se utiliza en el Server Component `MyVenues` y es compartido
 *   con el módulo de eventos (`events`) para poblar el selector de lugares al crear o editar un evento oficial.
 *
 * - **¿Cuál es su importancia?**:
 *   Facilita al propietario de establecimientos una vista centralizada de sus propiedades comerciales
 *   y permite vincular locales verificados/pendientes con la agenda de eventos institucionales.
 */
export class ListMyVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  /**
   * Ejecuta la consulta de lugares propios.
   *
   * - **¿Qué hace?**: Solicita al repositorio la lista de locales del usuario de la sesión.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna un arreglo de entidades de dominio `Venue[]`.
   * - **¿Cuál es su importancia?**: Proporciona los datos requeridos para la sección de administración propia y selectores de formulario.
   */
  execute(): Promise<Venue[]> {
    return this.venueRepository.listMine();
  }
}
