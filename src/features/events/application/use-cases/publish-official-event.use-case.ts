import type { Event, OfficialEventDraft } from "../../domain/entities/event";
import { normalizeOfficialEventInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Caso de Uso: Publicar Evento Oficial Institucional (RF-5.1)
 *
 * - **¿Qué hace?**: Normaliza y valida los datos del borrador oficial (`normalizeOfficialEventInput`)
 *   y delega la creación al repositorio, naciendo directamente con estado `CONFIRMADO` y origen `OFICIAL`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocado por `publishOfficialEventAction` cuando un usuario
 *   con rol `ADMIN` u `OWNER` publica un evento alojado en un recinto propio (`venue`).
 * - **¿Cuál es su importancia?**: Permite a los gestores de lugares y administradores publicar eventos verificados
 *   de manera inmediata sin pasar por la cola comunitaria de moderación.
 */
export class PublishOfficialEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(draft: OfficialEventDraft): Promise<Event> {
    return this.eventRepository.publishOfficial(normalizeOfficialEventInput(draft));
  }
}
