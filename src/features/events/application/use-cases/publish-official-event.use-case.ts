import type { Event, OfficialEventDraft } from "../../domain/entities/event";
import { normalizeOfficialEventInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Publica un evento oficial en un lugar propio. Nace CONFIRMADO, sin pasar por moderación (RF-5.1). */
export class PublishOfficialEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(draft: OfficialEventDraft): Promise<Event> {
    return this.eventRepository.publishOfficial(normalizeOfficialEventInput(draft));
  }
}
