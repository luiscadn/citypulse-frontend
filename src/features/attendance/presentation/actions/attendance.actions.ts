"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { attendanceContainer } from "../../di/attendance.container";
import type { AttendanceActionState } from "./attendance-action-state";

/** Guarda mi respuesta a un evento. El estado anterior se conserva si algo falla. */
export async function respondAttendanceAction(
  prev: AttendanceActionState,
  formData: FormData,
): Promise<AttendanceActionState> {
  // Una acción se puede invocar con un POST directo: no basta con que la página esté protegida
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const eventId = String(formData.get("eventId") ?? "");
  const status = String(formData.get("status") ?? "");
  try {
    await attendanceContainer.respondAttendanceUseCase.execute(eventId, status);
  } catch (error) {
    return { status: prev.status, error: actionErrorMessage(error) };
  }

  // El conteo de asistentes del detalle cambia: se vuelve a pedir la página
  refresh();
  return { status: status as AttendanceActionState["status"] };
}
