"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { friendshipContainer } from "../../di/friendship.container";
import type { FriendRequestAnswer } from "../../domain/entities/friendship";
import type { FriendshipActionState } from "./friendship-action-state";

function isAnswer(value: FormDataEntryValue | null): value is FriendRequestAnswer {
  return value === "ACEPTADA" || value === "RECHAZADA";
}

export async function respondFriendRequestAction(
  _prev: FriendshipActionState,
  formData: FormData,
): Promise<FriendshipActionState> {
  // Una acción se puede invocar con un POST directo: no basta con que la página esté protegida
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requestId = Number(formData.get("requestId"));
  const answer = formData.get("answer");
  if (!Number.isInteger(requestId) || requestId <= 0 || !isAnswer(answer)) {
    return { error: "La solicitud no es válida" };
  }

  try {
    await friendshipContainer.respondFriendRequestUseCase.execute(requestId, answer);
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message };
    }
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }

  refresh();
  return {};
}
