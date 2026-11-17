import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { GetEventAttendeesUseCase } from "../application/use-cases/get-event-attendees.use-case";
import { GetFriendsAttendanceUseCase } from "../application/use-cases/get-friends-attendance.use-case";
import { GetMyAttendanceUseCase } from "../application/use-cases/get-my-attendance.use-case";
import { RespondAttendanceUseCase } from "../application/use-cases/respond-attendance.use-case";
import { HttpAttendanceRepository } from "../infrastructure/repositories/http-attendance-repository";

/** Arma los casos de uso de asistencia con sus implementaciones concretas. */
const attendanceRepository = new HttpAttendanceRepository(serverHttp);

export const attendanceContainer = {
  getMyAttendanceUseCase: new GetMyAttendanceUseCase(attendanceRepository),
  respondAttendanceUseCase: new RespondAttendanceUseCase(attendanceRepository),
  getFriendsAttendanceUseCase: new GetFriendsAttendanceUseCase(attendanceRepository),
  getEventAttendeesUseCase: new GetEventAttendeesUseCase(attendanceRepository),
};
