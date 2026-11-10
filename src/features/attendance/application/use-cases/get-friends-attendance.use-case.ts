import type { EventAttendance } from "../../domain/entities/attendance";
import { assertValidAttendanceEvent } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/** Trae las respuestas de mis amigos a un evento, incluidas las de quienes dijeron que no irán. */
export class GetFriendsAttendanceUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async execute(eventId: string): Promise<readonly EventAttendance[]> {
    assertValidAttendanceEvent(eventId);
    return this.attendanceRepository.getFriendsAttendance(eventId);
  }
}
