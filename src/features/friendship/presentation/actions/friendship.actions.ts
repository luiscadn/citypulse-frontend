"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { friendshipContainer } from "../../di/friendship.container";
import type { FriendRequestAnswer } from "../../domain/entities/friendship";
import type { FriendshipActionState } from "./friendship-action-state";

/** Función guardián para validar si un valor de formulario es FriendRequestAnswer válido */
function isAnswer(value: FormDataEntryValue | null): value is FriendRequestAnswer {
  return value === "ACEPTADA" || value === "RECHAZADA";
}

/** Transforma cualquier error en una estructura `FriendshipActionState` */
function toErrorState(error: unknown): FriendshipActionState {
  if (error instanceof DomainError) {
    return { error: error.message };
  }
  return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
}

/**
 * Server Action: respondFriendRequestAction
 *
 * - **¿Qué hace?**: Procesa la decisión (`"ACEPTADA"` o `"RECHAZADA"`) sobre una solicitud de amistad.
 *   Verifica sesión, valida el ID y la respuesta, ejecuta `respondFriendRequestUseCase` y refresca la caché de la página con `refresh()`.
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza a `FriendRequestActions`.
 * - **¿Cuál es su importancia?**: Gestiona la formalización de relaciones sociales en el servidor.
 */
export async function respondFriendRequestAction(
  _prev: FriendshipActionState,
  formData: FormData,
): Promise<FriendshipActionState> {
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
    return toErrorState(error);
  }

  refresh();
  return {};
}

/**
 * Server Action: sendFriendRequestAction
 *
 * - **¿Qué hace?**: Envía una solicitud de amistad al usuario objetivo especificado en `targetUserId`.
 *   Verifica sesión, ejecuta `sendFriendRequestUseCase` y refresca la vista con `refresh()`.
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza al botón `SendFriendRequestButton` en los resultados de búsqueda.
 * - **¿Cuál es su importancia?**: Inicia el flujo de conexión entre usuarios garantizando la identidad del solicitante.
 */
export async function sendFriendRequestAction(
  _prev: FriendshipActionState,
  formData: FormData,
): Promise<FriendshipActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    await friendshipContainer.sendFriendRequestUseCase.execute(
      user.id,
      Number(formData.get("targetUserId")),
    );
  } catch (error) {
    return toErrorState(error);
  }

  refresh();
  return {};
}
