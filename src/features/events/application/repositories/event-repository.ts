import type { Event, EventDetail, EventFilters, EventInput, EventPage } from "../../domain/entities/event";

/** Puerto: lo que la aplicación necesita del backend para manejar eventos. */
export interface EventRepository {
  list(filters: EventFilters): Promise<EventPage>;
  findById(id: string): Promise<EventDetail>;
  /** Reporte ciudadano del usuario de la sesión. Nace REPORTADO. */
  report(input: EventInput): Promise<Event>;
  update(id: string, input: EventInput): Promise<Event>;
  cancel(id: string): Promise<void>;
}
