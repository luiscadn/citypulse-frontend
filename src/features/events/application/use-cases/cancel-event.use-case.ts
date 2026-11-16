import { assertValidEventId } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Cancela un evento (su autor o un ADMIN). El evento se conserva, con estado CANCELADO (RF-5.6). */
export class CancelEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<void> {
    assertValidEventId(id);
    await this.eventRepository.cancel(id);
  }
}
