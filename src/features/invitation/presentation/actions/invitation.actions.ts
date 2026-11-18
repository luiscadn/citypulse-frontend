"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { invitationContainer } from "../../di/invitation.container";
import type { InvitationAnswer } from "../../domain/entities/invitation";
import type { InvitationActionState } from "./invitation-action-state";

/** Función guardián para validar si un valor de FormData coincide con los valores permitidos de InvitationAnswer */
function isAnswer(value: FormDataEntryValue | null): value is InvitationAnswer {
  return value === "ACEPTADA" || value === "RECHAZADA";
}

/** Transforma cualquier error en una estructura `InvitationActionState` con mensaje comprensible */
function toErrorState(error: unknown): InvitationActionState {
  if (error instanceof DomainError) {
    return { error: error.message };
  }
  return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
}

/**
 * Server Action: respondInvitationAction
 *
 * - **¿Qué hace?**: Procesa la respuesta (`"ACEPTADA"` o `"RECHAZADA"`) a una invitación. Valida que el usuario tenga
 *   sesión activa, valida los parámetros `invitationId` y `answer`, ejecuta el caso de uso `respondInvitationUseCase`,
 *   y refresca la caché de la página con `refresh()`.
 * - **¿Cómo interactúa con el sistema en general?**: Se vincula al formulario de respuesta en `InvitationAnswerActions`.
 * - **¿Cuál es su importancia?**: Punto central de mutación para resolver invitaciones pendientes en el servidor,
 *   garantizando autorización de identidad y revalidación inmediata de la vista.
 */
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
