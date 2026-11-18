import type { AttendanceStatus } from "../../domain/entities/attendance";

/**
 * DTO MyAttendanceDto
 *
 * - **¿Qué hace?**: Modela la respuesta JSON devuelta por el backend al consultar `GET /attendance/event/:eventId/me`.
 * - **¿Cómo interactúa con el sistema en general?**: Deserializado en `HttpAttendanceRepository.getMyStatus`.
 * - **¿Cuál es su importancia?**: Aísla el modelo de dominio del contrato de red específico de este endpoint.
 */
export interface MyAttendanceDto {
  status: AttendanceStatus | null;
}

/**
 * DTO EventAttendanceDto
 *
 * - **¿Qué hace?**: Modela cada elemento del arreglo devuelto por los endpoints `GET /attendance/event/:eventId`
 *   y `GET /attendance/event/:eventId/friends`.
 * - **¿Cómo interactúa con el sistema en general?**: Es recibido por `HttpAttendanceRepository` y transformado
 *   por `toEventAttendance` a la entidad `EventAttendance`.
 * - **¿Cuál es su importancia?**: Filtra campos irrelevantes o sensibles provenientes de la base de datos del backend
 *   antes de propagar los datos a la capa de aplicación.
 */
export interface EventAttendanceDto {
  status: AttendanceStatus;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}
