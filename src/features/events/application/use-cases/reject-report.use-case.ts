import { assertValidEventId, normalizeRejectionReason } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Caso de Uso: Rechazar Reporte Comunitario con Justificación (RF-4.4)
 *
 * - **¿Qué hace?**: Valida el identificador del evento (`assertValidEventId`), normaliza la justificación
 *   obligatoria (`normalizeRejectionReason`) e invoca `rejectReport` en el repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Ejecutado por `rejectReportAction` desde el panel
 *   de revisión (`ReviewReportPanel`) en el área administrativa.
 * - **¿Cuál es su importancia?**: Garantiza transparencia en el proceso de moderación obligando a ingresar un
 *   motivo de rechazo concreto que luego será visible para el autor del reporte en su vista de detalle.
 */
export class RejectReportUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string, reason: string): Promise<void> {
    assertValidEventId(id);
    await this.eventRepository.rejectReport(id, normalizeRejectionReason(reason));
  }
}
