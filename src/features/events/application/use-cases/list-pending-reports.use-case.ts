import type { PendingReport } from "../../domain/entities/event";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Caso de Uso: Listar Reportes Pendientes de Moderación
 *
 * - **¿Qué hace?**: Consulta al repositorio la lista de reportes en revisión ordenados cronológicamente
 *   desde el más antiguo al más reciente, acompañados de sus respectivas evidencias.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta en el Server Component `ModerationQueue`
 *   en la ruta protegida de administración `/admin/moderation`.
 * - **¿Cuál es su importancia?**: Proporciona a los administradores una bandeja de entrada centralizada (FIFO)
 *   para auditar los eventos reportados por la ciudadanía antes de publicarlos o rechazarlos.
 */
export class ListPendingReportsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  execute(): Promise<readonly PendingReport[]> {
    return this.eventRepository.listPendingReports();
  }
}
