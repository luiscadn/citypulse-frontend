"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { attendanceContainer } from "../../di/attendance.container";
import type { AttendanceActionState } from "./attendance-action-state";

/**
 * Server Action: Responder o Cambiar Asistencia a un Evento
 *
 * - **¿Qué hace?**: Verifica que el usuario cuente con sesión activa, extrae los parámetros `eventId` y `status` del `FormData`,
 *   ejecuta `attendanceContainer.respondAttendanceUseCase.execute` y solicita la revalidación del árbol con `refresh()`.
 *   Si la operación falla, preserva el estado anterior (`prev.status`) devolviendo el mensaje de error.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada por el selector de asistencia `AttendancePicker` a través de `useAttendance`.
 * - **¿Cuál es su importancia?**: Permite a los usuarios marcar su intención de asistencia (`Asistiré`, `Tal vez`, `No iré`)
 *   actualizando instantáneamente el conteo general de asistentes del evento en el servidor.
 */
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
