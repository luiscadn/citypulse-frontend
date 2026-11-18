/**
 * @file list-events.use-case.ts
 * @description Caso de uso para obtener la cartelera de Eventos paginada y filtrada.
 */

import type { EventFilters, EventPage } from "../../domain/entities/event";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Consulta el listado de eventos según los filtros aplicados (zona, estado, origen, fechas, búsqueda y página).
 *
 * - **¿Qué hace?**:
 *   Transmite los filtros limpios de dominio (`EventFilters`) hacia el repositorio, retornando la página de eventos correspondiente.
 *   El backend se encarga de determinar la visibilidad según los roles y la sesión del usuario (RF-6).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Consumido por el Server Component `EventList` en la ruta `/events`.
 *
 * - **¿Cuál es su importancia?**:
 *   Facilita a la ciudadanía y a los administradores la exploración flexible y segmentada de la cartelera de eventos.
 */
export class ListEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta la consulta paginada de eventos.
   *
   * - **¿Qué hace?**: Solicita al repositorio la página de eventos que coincide con los filtros.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna una estructura `EventPage` con eventos y metadatos de paginación.
   * - **¿Cuál es su importancia?**: Proporciona el punto de acceso desacoplado para poblar la cartelera general.
   */
  execute(filters: EventFilters): Promise<EventPage> {
    return this.eventRepository.list(filters);
  }
}
