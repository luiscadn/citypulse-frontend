import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { GetEventAttendeesUseCase } from "../application/use-cases/get-event-attendees.use-case";
import { GetFriendsAttendanceUseCase } from "../application/use-cases/get-friends-attendance.use-case";
import { GetMyAttendanceUseCase } from "../application/use-cases/get-my-attendance.use-case";
import { RespondAttendanceUseCase } from "../application/use-cases/respond-attendance.use-case";
import { HttpAttendanceRepository } from "../infrastructure/repositories/http-attendance-repository";

/**
 * Contenedor de Inyección de Dependencias del Módulo de Asistencia (Attendance DI Container)
 *
 * - **¿Qué hace?**: Instancia el repositorio de infraestructura `HttpAttendanceRepository` inyectándole el cliente HTTP
 *   autenticado del servidor (`serverHttp`), y construye los casos de uso del módulo:
 *   - `getMyAttendanceUseCase`: Obtiene el estado de asistencia del usuario en sesión.
 *   - `respondAttendanceUseCase`: Registra o cambia la confirmación de asistencia a un evento.
 *   - `getFriendsAttendanceUseCase`: Obtiene las respuestas de asistencia de los amigos del usuario.
 *   - `getEventAttendeesUseCase`: Lista completa de asistentes para el autor del evento o administradores.
 *
 * - **¿Cómo interactúa con el sistema en general?**: Es el punto de composición (Composition Root) consumido por
 *   las Server Actions (`attendance.actions.ts`) y los Server Components (`EventAttendance`).
 *
 * - **¿Cuál es su importancia?**: Implementa el Principio de Inversión de Dependencias (DIP) de SOLID y Clean Architecture,
 *   garantizando que la capa de aplicación dependa de abstracciones mientras este contenedor conecta las implementaciones concretas.
 */
const attendanceRepository = new HttpAttendanceRepository(serverHttp);

export const attendanceContainer = {
  getMyAttendanceUseCase: new GetMyAttendanceUseCase(attendanceRepository),
  respondAttendanceUseCase: new RespondAttendanceUseCase(attendanceRepository),
  getFriendsAttendanceUseCase: new GetFriendsAttendanceUseCase(attendanceRepository),
  getEventAttendeesUseCase: new GetEventAttendeesUseCase(attendanceRepository),
};
