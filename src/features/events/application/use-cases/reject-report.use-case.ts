import { assertValidEventId, normalizeRejectionReason } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Rechaza un reporte con un motivo obligatorio, que verá su autor (RF-4.4). */
export class RejectReportUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string, reason: string): Promise<void> {
    assertValidEventId(id);
    await this.eventRepository.rejectReport(id, normalizeRejectionReason(reason));
  }
}
