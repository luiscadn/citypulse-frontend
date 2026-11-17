import type { EvidenceDraft } from "../../domain/entities/event";
import { assertValidEventId, normalizeEvidenceInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Adjunta una evidencia a un reporte para que un ADMIN lo pueda confirmar (RF-3.4). */
export class AddEvidenceUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, draft: EvidenceDraft): Promise<void> {
    assertValidEventId(eventId);
    await this.eventRepository.addEvidence(eventId, normalizeEvidenceInput(draft));
  }
}
