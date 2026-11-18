"use client";

import { useActionState } from "react";
import type { AttendanceStatus } from "../../domain/entities/attendance";
import { respondAttendanceAction } from "../actions/attendance.actions";

/**
 * Hook fachada para gestionar la respuesta de asistencia de un usuario a un evento.
 *
 * - **¿Qué hace?**: Enlaza la Server Action `respondAttendanceAction` mediante el hook `useActionState` de React 19,
 *   inicializando con el estado actual (`initialStatus`) y exponiendo el estado reactivo (`status`), errores (`error`),
 *   la función despachadora (`respond`) y el indicador de carga (`pending`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente cliente `AttendancePicker` dentro
 *   de la sección `EventAttendance` en el detalle del evento.
 * - **¿Cuál es su importancia?**: Oculta la complejidad de las Server Actions y la gestión de mutaciones asíncronas
 *   detrás de una API limpia y declarativa para los componentes de presentación.
 */
export function useAttendance(initialStatus: AttendanceStatus | null) {
  const [state, respond, pending] = useActionState(respondAttendanceAction, { status: initialStatus });
  return { status: state.status, error: state.error, respond, pending };
}
