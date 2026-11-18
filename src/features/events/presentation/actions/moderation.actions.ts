"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { eventContainer } from "../../di/event.container";
import { canModerateEvents } from "../../domain/rules/event-permissions";
import type { EventActionState, RejectReportState } from "./event-form-state";

const NOT_ADMIN = "Solo un administrador revisa reportes.";

/**
 * Función de seguridad para verificar privilegios de moderación en el servidor.
 *
 * - **¿Qué hace?**: Obtiene el usuario de la sesión actual, redirige a `/login` si no está autenticado,
 *   y evalúa la regla de dominio `canModerateEvents(user)`.
 * - **¿Cómo interactúa con el sistema en general?**: Llamada al inicio de `confirmReportAction` y `rejectReportAction`.
 * - **¿Cuál es su importancia?**: Asegura el principio de Defensa en Profundidad (Defense in Depth): una Server Action
 *   puede invocarse mediante una petición HTTP POST directa, por lo que nunca basta con ocultar los botones en la UI.
 */
async function requireModerator(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return canModerateEvents(user);
}

/**
 * Server Action: Confirmar Reporte de Evento Comunitario
 *
 * - **¿Qué hace?**: Verifica permisos de moderación, extrae el `eventId` del `FormData`, ejecuta
 *   `confirmReportUseCase.execute(id)` y solicita la revalidación de caché con `refresh()`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada desde `ReviewReportPanel` a través del hook `useReviewReport`.
 * - **¿Cuál es su importancia?**: Aprueba y publica el evento en la cartelera general sin recargar la página.
 */
export async function confirmReportAction(_prev: EventActionState, formData: FormData): Promise<EventActionState> {
  if (!(await requireModerator())) return { error: NOT_ADMIN };

  try {
    await eventContainer.confirmReportUseCase.execute(String(formData.get("eventId") ?? ""));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  refresh();
  return {};
}

/**
 * Server Action: Rechazar Reporte Comunitario con Motivo
 *
 * - **¿Qué hace?**: Verifica permisos de moderación, extrae el `eventId` y el texto de `reason`, ejecuta
 *   `rejectReportUseCase.execute(id, reason)` y actualiza la caché con `refresh()`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada desde el formulario de rechazo en `ReviewReportPanel`.
 * - **¿Cuál es su importancia?**: Registra la justificación administrativa del rechazo y preserva el texto ingresado en caso de error.
 */
export async function rejectReportAction(_prev: RejectReportState, formData: FormData): Promise<RejectReportState> {
  const reason = String(formData.get("reason") ?? "");
  if (!(await requireModerator())) return { reason, error: NOT_ADMIN };

  try {
    await eventContainer.rejectReportUseCase.execute(String(formData.get("eventId") ?? ""), reason);
  } catch (error) {
    return { reason, error: actionErrorMessage(error) };
  }

  refresh();
  return { reason: "" };
}
