import type { EventAttendance } from "../../domain/entities/attendance";
import type { EventAttendanceDto } from "../dtos/attendance.dto";

/**
 * Función toEventAttendance (Mapper DTO -> Entidad de Dominio)
 *
 * - **¿Qué hace?**: Convierte un objeto `EventAttendanceDto` proveniente de la respuesta HTTP en una entidad pura `EventAttendance`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada en `HttpAttendanceRepository` al procesar listas de asistentes.
 * - **¿Cuál es su importancia?**: Asegura que el dominio y la presentación trabajen exclusivamente con entidades tipadas
 *   y desacopladas del formato de red.
 */
export function toEventAttendance(dto: EventAttendanceDto): EventAttendance {
  return {
    status: dto.status,
    user: {
      id: dto.user.id,
      username: dto.user.username,
      fullName: dto.user.fullName,
    },
  };
}
