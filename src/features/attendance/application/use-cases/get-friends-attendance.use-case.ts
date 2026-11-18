import type { EventAttendance } from "../../domain/entities/attendance";
import { assertValidAttendanceEvent } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/**
 * Caso de Uso: GetFriendsAttendanceUseCase
 *
 * - **¿Qué hace?**: Obtiene las respuestas de asistencia de los amigos del usuario autenticado para un evento en particular.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta en `EventDetail` para enriquecer la experiencia social
 *   del evento (mostrando "X amigos asistirán").
 * - **¿Cuál es su importancia?**: Estimula la interacción social y la participación en actividades comunitarias,
 *   mostrando de manera transparente las decisiones de asistencia del círculo de amistades del usuario.
 */
export class GetFriendsAttendanceUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta la consulta de asistencia de amigos.
   *
   * @param eventId - Identificador UUID del evento.
   * @returns Lista de amistades y su estado de confirmación.
   */
  async execute(eventId: string): Promise<readonly EventAttendance[]> {
    assertValidAttendanceEvent(eventId);
    return this.attendanceRepository.getFriendsAttendance(eventId);
  }
}
