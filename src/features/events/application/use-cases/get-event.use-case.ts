import type { EventDetail } from "../../domain/entities/event";
import { EventNotFoundError } from "../../domain/errors/event-errors";
import { isValidEventId } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/** Detalle de un evento. Un ID imposible se trata como evento inexistente, sin llamar al backend. */
export class GetEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<EventDetail> {
    if (!isValidEventId(id)) throw new EventNotFoundError();
    return this.eventRepository.findById(id);
  }
}
