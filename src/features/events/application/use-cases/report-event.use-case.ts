/**
 * @file report-event.use-case.ts
 * @description Caso de uso para que un ciudadano reporte un nuevo Evento comunitario.
 */

import type { Event, EventDraft } from "../../domain/entities/event";
import { normalizeEventInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Orquesta la creación de un reporte ciudadano de evento a nombre del usuario en sesión (RF-3.1, RF-3.2).
 *
 * - **¿Qué hace?**:
 *   Toma el borrador del formulario (`EventDraft`), lo sanea y valida estrictamente mediante `normalizeEventInput`,
 *   y envía los datos normalizados al repositorio. El evento nace automáticamente con estado `REPORTADO` y origen comunitario.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Invocado por la Server Action `reportEventAction` en `/events/new`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que los reportes generados por la comunidad cumplan con todas las restricciones de negocio
 *   (fechas coherentes, zona válida y límites de texto) antes de ser sometidos a moderación administrativa.
 */
export class ReportEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el reporte ciudadano del evento.
   *
   * - **¿Qué hace?**: Normaliza el borrador y delega la creación al repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad `Event` creada con su nuevo UUID generado.
   * - **¿Cuál es su importancia?**: Centraliza la lógica de alta comunitaria desacoplada del protocolo HTTP.
   */
  async execute(draft: EventDraft): Promise<Event> {
    return this.eventRepository.report(normalizeEventInput(draft));
  }
}
