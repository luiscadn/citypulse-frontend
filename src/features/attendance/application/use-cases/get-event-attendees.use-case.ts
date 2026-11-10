import type { EventAttendance } from "../../domain/entities/attendance";
import { assertValidAttendanceEvent } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/** Trae las respuestas de todos a un evento. El backend solo se las da al autor o a un administrador. */
export class GetEventAttendeesUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async execute(eventId: string): Promise<readonly EventAttendance[]> {
    assertValidAttendanceEvent(eventId);
    return this.attendanceRepository.getAttendees(eventId);
  }
}
