import type { AttendanceStatus } from "../../domain/entities/attendance";

/** Estado del selector de asistencia (useActionState). */
export interface AttendanceActionState {
  /** Mi respuesta guardada; null si todavía no he respondido */
  status: AttendanceStatus | null;
  error?: string;
}
