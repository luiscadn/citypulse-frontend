import { assertValidEventId } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Caso de Uso: Confirmar Reporte Comunitario de Evento (RF-4.3)
 *
 * - **¿Qué hace?**: Valida el identificador del evento e invoca `confirmReport(id)` en el repositorio,
 *   haciendo que el reporte pase de estado `REPORTADO` a `CONFIRMADO`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocado por moderadores/administradores a través de
 *   `confirmReportAction` desde la interfaz de moderación.
 * - **¿Cuál es su importancia?**: Habilita la verificación oficial de eventos generados por la comunidad,
 *   incorporándolos como eventos legítimos y visibles en toda la cartelera ciudadana.
 */
export class ConfirmReportUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<void> {
    assertValidEventId(id);
    await this.eventRepository.confirmReport(id);
  }
}
