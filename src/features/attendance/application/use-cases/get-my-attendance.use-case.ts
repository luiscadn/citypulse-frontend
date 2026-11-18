import type { AttendanceStatus } from "../../domain/entities/attendance";
import { assertValidAttendanceEvent } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/**
 * Caso de Uso: GetMyAttendanceUseCase
 *
 * - **¿Qué hace?**: Consulta el estado de asistencia actual del usuario en sesión respecto a un evento (`"ASISTIRE"`, `"QUIZAS"`, `"NO_ASISTIRE"` o `null`).
 * - **¿Cómo interactúa con el sistema en general?**: Es consultado en `EventDetail` para determinar qué botón del selector
 *   de asistencia debe aparecer resaltado o activo en la interfaz.
 * - **¿Cuál es su importancia?**: Permite al usuario reconocer instantáneamente si ya confirmó asistencia a un evento
 *   y cambiar su respuesta si así lo desea.
 */
export class GetMyAttendanceUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta la consulta de la respuesta personal del usuario.
   *
   * @param eventId - Identificador UUID del evento.
   * @returns El estado de asistencia o `null` si no ha respondido.
   */
  async execute(eventId: string): Promise<AttendanceStatus | null> {
    assertValidAttendanceEvent(eventId);
    return this.attendanceRepository.getMyStatus(eventId);
  }
}
