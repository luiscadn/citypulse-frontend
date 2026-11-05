import type { EventAttendance } from "../../domain/entities/attendance";
import type { EventAttendanceDto } from "../dtos/attendance.dto";

/** Solo copia los campos de la entidad: lo demás que mande el backend no llega a la UI. */
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
