"use client";

import { useActionState } from "react";
import type { AttendanceStatus } from "../../domain/entities/attendance";
import { respondAttendanceAction } from "../actions/attendance.actions";

/** Hook fachada de mi respuesta a un evento: la respuesta actual y la acción para cambiarla. */
export function useAttendance(initialStatus: AttendanceStatus | null) {
  const [state, respond, pending] = useActionState(respondAttendanceAction, { status: initialStatus });
  return { status: state.status, error: state.error, respond, pending };
}
