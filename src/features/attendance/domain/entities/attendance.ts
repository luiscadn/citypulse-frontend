/**
 * Constante ATTENDANCE_STATUSES y Tipo AttendanceStatus
 *
 * - **¿Qué hace?**: Define los estados posibles para la confirmación de asistencia a un evento:
 *   - `"ASISTIRE"`: Asistencia confirmada.
 *   - `"QUIZAS"`: Interesado / asistencia tentativa.
 *   - `"NO_ASISTIRE"`: Declinación formal de asistencia.
 * - **¿Cómo interactúa con el sistema en general?**: Coincide estrictamente con los valores aceptados por el backend.
 *   Se utiliza en formularios de asistencia (`EventDetail`), reglas de validación (`attendance-input.ts`),
 *   mapeadores de colores (`statusTones`) y repositorios de asistencia.
 * - **¿Cuál es su importancia?**: Proporciona seguridad de tipos en tiempo de compilación y garantiza consistencia semántica
 *   entre la UI y la base de datos para el seguimiento de aforo y quórum en eventos.
 */
export const ATTENDANCE_STATUSES = ["ASISTIRE", "QUIZAS", "NO_ASISTIRE"] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

/**
 * Entidad de Dominio AttendanceUser
 *
 * - **¿Qué hace?**: Modela la representación pública y acotada del usuario que responde a un evento:
 *   identificador numérico (`id`), nombre de usuario (`username`) y nombre completo (`fullName`).
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada en `EventAttendance` para renderizar avatares
 *   y nombres de asistentes sin exponer datos privados como correos electrónicos o contraseñas.
 * - **¿Cuál es su importancia?**: Aplica el principio de mínimo privilegio y protección de datos personales (privacidad por diseño)
 *   al filtrar atributos sensibles antes de que lleguen a los componentes de presentación.
 */
export interface AttendanceUser {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/**
 * Entidad de Dominio EventAttendance
 *
 * - **¿Qué hace?**: Asocia a un usuario (`AttendanceUser`) con su estado de respuesta (`AttendanceStatus`) hacia un evento específico.
 * - **¿Cómo interactúa con el sistema en general?**: Es devuelta por los casos de uso `GetEventAttendeesUseCase`
 *   y `GetFriendsAttendanceUseCase`, alimentando las listas de asistentes visibles en el detalle del evento.
 * - **¿Cuál es su importancia?**: Encapsula la relación de asistencia, permitiendo a la UI distinguir entre usuarios confirmados,
 *   tentativos o ausentes para renderizar estadísticas y filtros sociales.
 */
export interface EventAttendance {
  readonly user: AttendanceUser;
  readonly status: AttendanceStatus;
}
