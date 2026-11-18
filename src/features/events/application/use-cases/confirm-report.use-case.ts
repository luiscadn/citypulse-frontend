import { assertValidEventId } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Confirma un reporte: pasa a CONFIRMADO y queda verificado por el ADMIN (RF-4.3). */
export class ConfirmReportUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<void> {
    assertValidEventId(id);
    await this.eventRepository.confirmReport(id);
  }
}
