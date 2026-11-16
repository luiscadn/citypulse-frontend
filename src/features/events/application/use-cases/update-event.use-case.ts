import type { Event, EventDraft } from "../../domain/entities/event";
import { assertValidEventId, normalizeEventInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Edita un reporte (su autor o un ADMIN), solo mientras siga en REPORTADO (RF-3.5). */
export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string, draft: EventDraft): Promise<Event> {
    assertValidEventId(id);
    return this.eventRepository.update(id, normalizeEventInput(draft));
  }
}
