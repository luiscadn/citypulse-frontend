import { assertValidAttendanceEvent, assertValidAttendanceStatus } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/**
 * Caso de Uso: RespondAttendanceUseCase
 *
 * - **¿Qué hace?**: Registra o actualiza la confirmación de asistencia del usuario actual hacia un evento.
 *   Valida previamente que el ID del evento sea un UUID correcto y que el estado sea válido mediante `assertValidAttendanceStatus`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde la Server Action `respondAttendanceAction`
 *   en el bounded context de eventos.
 * - **¿Cuál es su importancia?**: Centraliza la mutación de estado de asistencia, protegiendo las reglas de negocio
 *   y asegurando la integridad de los datos antes de llamar al repositorio.
 */
export class RespondAttendanceUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta el registro de la respuesta de asistencia.
   *
   * @param eventId - Identificador UUID del evento.
   * @param status - Respuesta seleccionada por el usuario ("ASISTIRE", "QUIZAS", "NO_ASISTIRE").
   */
  async execute(eventId: string, status: string): Promise<void> {
    assertValidAttendanceEvent(eventId);
    assertValidAttendanceStatus(status);
    await this.attendanceRepository.respond(eventId, status);
  }
}
