import type { EventFilters, EventPage } from "../../domain/entities/event";
import type { EventRepository } from "../repositories/event-repository";

/** Listado de eventos filtrado y paginado. El backend decide cuáles puede ver cada persona (RF-6). */
export class ListEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  execute(filters: EventFilters): Promise<EventPage> {
    return this.eventRepository.list(filters);
  }
}
