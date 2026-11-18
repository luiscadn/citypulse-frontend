/**
 * @file update-event.use-case.ts
 * @description Caso de uso para modificar los datos de un Evento existente.
 */

import type { Event, EventDraft } from "../../domain/entities/event";
import { assertValidEventId, normalizeEventInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Orquesta la actualización de un reporte de evento mientras permanezca en revisión (RF-3.5).
 *
 * - **¿Qué hace?**:
 *   Verifica la validez del UUID (`assertValidEventId`), normaliza y valida el borrador de cambios (`normalizeEventInput`),
 *   y envía la actualización a través de `EventRepository.update`. Solo es permitido si el evento sigue en estado `REPORTADO`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Invocado por la Server Action `updateEventAction`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite a los usuarios autores corregir erratas o ajustar detalles de sus reportes antes de la revisión administrativa.
 */
export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta la actualización del evento.
   *
   * - **¿Qué hace?**: Valida el identificador y el borrador, y delega la actualización al repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad de dominio `Event` actualizada.
   * - **¿Cuál es su importancia?**: Centraliza la mutación de eventos aplicando validaciones previas de pureza.
   */
  async execute(id: string, draft: EventDraft): Promise<Event> {
    assertValidEventId(id);
    return this.eventRepository.update(id, normalizeEventInput(draft));
  }
}
