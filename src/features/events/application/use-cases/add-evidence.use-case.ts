import type { EvidenceDraft } from "../../domain/entities/event";
import { assertValidEventId, normalizeEvidenceInput } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Caso de Uso: Adjuntar Evidencia a un Reporte de Evento (RF-3.4)
 *
 * - **¿Qué hace?**: Valida el identificador del evento (`assertValidEventId`), normaliza y valida
 *   el borrador de evidencia (`normalizeEvidenceInput`), y delega su persistencia al repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Orquestado por
 *   `addEvidenceAction` en la capa de Presentación y ejecutado contra el puerto `EventRepository`.
 * - **¿Cuál es su importancia?**: Permite a la comunidad ciudadana respaldar sus reportes con fotos,
 *   enlaces o documentos públicos para que un administrador verifique su autenticidad.
 */
export class AddEvidenceUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, draft: EvidenceDraft): Promise<void> {
    assertValidEventId(eventId);
    await this.eventRepository.addEvidence(eventId, normalizeEvidenceInput(draft));
  }
}
