import type { Event, EventDraft } from "../../domain/entities/event";
import { normalizeEventInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Reporta un evento a nombre del usuario de la sesión. Nace REPORTADO y siempre público (RF-3.1, RF-3.2). */
export class ReportEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(draft: EventDraft): Promise<Event> {
    return this.eventRepository.report(normalizeEventInput(draft));
  }
}
