import type { AttendanceStatus } from "../../domain/entities/attendance";
import { assertValidAttendanceEvent } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/** Trae mi respuesta a un evento, o null si todavía no he respondido. */
export class GetMyAttendanceUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async execute(eventId: string): Promise<AttendanceStatus | null> {
    assertValidAttendanceEvent(eventId);
    return this.attendanceRepository.getMyStatus(eventId);
  }
}
