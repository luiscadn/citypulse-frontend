"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { eventContainer } from "../../di/event.container";
import { canModerateEvents } from "../../domain/rules/event-permissions";
import type { EventActionState, RejectReportState } from "./event-form-state";

const NOT_ADMIN = "Solo un administrador revisa reportes.";

/** Una acción se puede invocar con un POST directo: no basta con ocultar los botones. */
async function requireModerator(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return canModerateEvents(user);
}

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
