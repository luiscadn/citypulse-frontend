/**
 * @file cancel-event.use-case.ts
 * @description Caso de uso para cancelar un Evento existente en el sistema.
 */

import { assertValidEventId } from "../../domain/rules/event-input";
import type { EventRepository } from "../repositories/event-repository";

/**
 * Orquesta la cancelación de un evento por parte de su autor o de un Administrador (RF-5.6).
 *
 * - **¿Qué hace?**:
 *   Verifica que el identificador sea un UUID válido (`assertValidEventId`) y solicita al repositorio
 *   la cancelación del evento. El evento se preserva en la base de datos cambiando su estado a `CANCELADO`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es invocado por la Server Action `cancelEventAction`
 *   y utiliza el puerto `EventRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura que la desconvocatoria de un evento mantenga la trazabilidad histórica y visibilidad pública
 *   para advertir a los asistentes, en lugar de borrarlo abruptamente.
 */
export class CancelEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta la cancelación del evento indicado.
   *
   * - **¿Qué hace?**: Valida el identificador UUID y llama al método `cancel` del repositorio.
   * - **¿Cómo interactúa con el sistema en general?**: Lanza excepciones de dominio (`InvalidEventError`, `EventNotFoundError`, `EventAlreadyCancelledError`) si falla.
   * - **¿Cuál es su importancia?**: Centraliza la lógica de despublicación ordenada de eventos.
   */
  async execute(id: string): Promise<void> {
    assertValidEventId(id);
    await this.eventRepository.cancel(id);
  }
}
