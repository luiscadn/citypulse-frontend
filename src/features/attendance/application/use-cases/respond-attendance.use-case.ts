import { assertValidAttendanceEvent, assertValidAttendanceStatus } from "../../domain/rules/attendance-input";
import type { AttendanceRepository } from "../repositories/attendance-repository";

/** Registra o cambia mi respuesta a un evento. */
export class RespondAttendanceUseCase {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async execute(eventId: string, status: string): Promise<void> {
    assertValidAttendanceEvent(eventId);
    assertValidAttendanceStatus(status);
    await this.attendanceRepository.respond(eventId, status);
  }
}
