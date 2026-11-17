import type { PendingReport } from "../../domain/entities/event";
import type { EventRepository } from "../repositories/event-repository";

/** Reportes en revisión con evidencias, del más antiguo al más nuevo (solo ADMIN). */
export class ListPendingReportsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  execute(): Promise<readonly PendingReport[]> {
    return this.eventRepository.listPendingReports();
  }
}
