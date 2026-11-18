/**
 * @file get-event.use-case.ts
 * @description Caso de uso para obtener la información detallada de un Evento por su ID.
 */

import type { EventDetail } from "../../domain/entities/event";
import { EventNotFoundError } from "../../domain/errors/event-errors";
import { isValidEventId } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Consulta y recupera la información exhaustiva de un evento a partir de su UUID.
 *
 * - **¿Qué hace?**:
 *   Verifica que el ID suministrado sea un UUID canónico; si no lo es, lanza inmediatamente `EventNotFoundError`.
 *   Si el formato es válido, delega la recuperación a `EventRepository.findById`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Consumido por el Server Component `EventDetail` para la ruta `/events/[id]`.
 *
 * - **¿Cuál es su importancia?**:
 *   Falla de manera inmediata (fail-fast) ante identificadores erróneos, evitando llamadas innecesarias al backend
 *   y facilitando la activación automática de la vista 404 en Next.js.
 */
export class GetEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta la consulta del detalle del evento.
   *
   * - **¿Qué hace?**: Comprueba el UUID y solicita los datos al repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad extendida `EventDetail` con evidencias y conteo de asistentes.
   * - **¿Cuál es su importancia?**: Proporciona el punto de acceso validado a la ficha completa de un evento.
   */
  async execute(id: string): Promise<EventDetail> {
    if (!isValidEventId(id)) throw new EventNotFoundError();
    return this.eventRepository.findById(id);
  }
}
