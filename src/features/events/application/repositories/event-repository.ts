import type {
  Event,
  EventDetail,
  EventFilters,
  EventInput,
  EventPage,
  EvidenceInput,
  OfficialEventInput,
  PendingReport,
} from "../../domain/entities/event";

/** Puerto: lo que la aplicación necesita del backend para manejar eventos. */
export interface EventRepository {
  list(filters: EventFilters): Promise<EventPage>;
  findById(id: string): Promise<EventDetail>;
  /** Reporte ciudadano del usuario de la sesión. Nace REPORTADO. */
  report(input: EventInput): Promise<Event>;
  update(id: string, input: EventInput): Promise<Event>;
  cancel(id: string): Promise<void>;
  /** Evento oficial en un lugar del usuario de la sesión. Nace CONFIRMADO. */
  publishOfficial(input: OfficialEventInput): Promise<Event>;
  addEvidence(eventId: string, input: EvidenceInput): Promise<void>;
  /** Cola de moderación: reportes en revisión que ya tienen evidencias (solo ADMIN). */
  listPendingReports(): Promise<readonly PendingReport[]>;
  confirmReport(id: string): Promise<void>;
  rejectReport(id: string, reason: string): Promise<void>;
}
