/** Respuestas posibles de asistencia (mismos valores que el backend). */
export const ATTENDANCE_STATUSES = ["ASISTIRE", "QUIZAS", "NO_ASISTIRE"] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

/** Lo que la UI muestra de quien respondió. Sin correo ni datos internos de la cuenta. */
export interface AttendanceUser {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/** Respuesta de una persona a un evento: no siempre significa que vaya a asistir. */
export interface EventAttendance {
  readonly user: AttendanceUser;
  readonly status: AttendanceStatus;
}
