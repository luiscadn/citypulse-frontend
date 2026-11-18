import type { AttendanceStatus } from "../../domain/entities/attendance";

/**
 * Estado retornado por las Server Actions del módulo de asistencia (`useActionState`).
 *
 * - **¿Qué hace?**: Estructura la respuesta de la mutación de asistencia conteniendo:
 *   - `status`: La opción de asistencia guardada (`ASISTIRE`, `QUIZAS`, `NO_ASISTIRE`) o `null` si aún no ha respondido.
 *   - `error`: Mensaje textual si ocurrió un fallo durante la invocación.
 * - **¿Cómo interactúa con el sistema en general?**: Interfaz utilizada entre `respondAttendanceAction` y el hook `useAttendance`.
 * - **¿Cuál es su importancia?**: Proporciona un contrato tipado seguro y consistente para el manejo de estado en el cliente.
 */
export interface AttendanceActionState {
  /** Mi respuesta guardada; null si todavía no he respondido */
  status: AttendanceStatus | null;
  error?: string;
}
