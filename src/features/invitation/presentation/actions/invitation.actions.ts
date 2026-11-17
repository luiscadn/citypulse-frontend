"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { invitationContainer } from "../../di/invitation.container";
import type { InvitationAnswer } from "../../domain/entities/invitation";
import type { InvitationActionState } from "./invitation-action-state";

function isAnswer(value: FormDataEntryValue | null): value is InvitationAnswer {
  return value === "ACEPTADA" || value === "RECHAZADA";
}

function toErrorState(error: unknown): InvitationActionState {
  if (error instanceof DomainError) {
    return { error: error.message };
  }
  return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
}

export async function respondInvitationAction(
  _prev: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  // Una acción se puede invocar con un POST directo: no basta con que la página esté protegida
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const invitationId = Number(formData.get("invitationId"));
  const answer = formData.get("answer");
  if (!Number.isInteger(invitationId) || invitationId <= 0 || !isAnswer(answer)) {
    return { error: "La invitación no es válida" };
  }

  try {
    await invitationContainer.respondInvitationUseCase.execute(invitationId, answer);
  } catch (error) {
    return toErrorState(error);
  }

  refresh();
  return {};
}

/** Invita a un amigo a un evento, con un mensaje opcional. */
export async function sendInvitationAction(
  _prev: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const message = String(formData.get("message") ?? "");
  try {
    await invitationContainer.sendInvitationUseCase.execute(user.id, {
      eventId: String(formData.get("eventId") ?? ""),
      toUserId: Number(formData.get("toUserId")),
      ...(message && { message }),
    });
  } catch (error) {
    return toErrorState(error);
  }

  return { success: "Invitación enviada." };
}
