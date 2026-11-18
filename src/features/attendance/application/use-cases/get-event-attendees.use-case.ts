import type { EventAttendance } from "../../domain/entities/attendance";
import { assertValidAttendanceEvent } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/**
 * Caso de Uso: GetEventAttendeesUseCase
 *
 * - **¿Qué hace?**: Obtiene la lista completa de asistentes a un evento específico. Valida que el `eventId` sea un UUID válido
 *   y delega la consulta al repositorio de asistencia.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. El backend únicamente autoriza esta
 *   consulta a usuarios con rol `ADMIN` o al organizador/creador del evento.
 * - **¿Cuál es su importancia?**: Permite a los organizadores conocer la concurrencia y aforo proyectado de sus eventos.
 */
export class GetEventAttendeesUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta la consulta de asistentes al evento.
   *
   * @param eventId - Identificador único UUID del evento.
   * @returns Lista de asistentes con sus datos públicos y estado de respuesta.
   */
  async execute(eventId: string): Promise<readonly EventAttendance[]> {
    assertValidAttendanceEvent(eventId);
    return this.attendanceRepository.getAttendees(eventId);
  }
}
