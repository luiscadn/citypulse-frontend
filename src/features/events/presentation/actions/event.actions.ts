"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import type { SessionUser } from "@/features/auth/domain/entities/session-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { eventContainer } from "../../di/event.container";
import type { EventDraft } from "../../domain/entities/event";
import {
  EventAddressTooLongError,
  EventDatesOrderError,
  EventEndDateRequiredError,
  EventStartDateRequiredError,
  EventTitleRequiredError,
  EventTitleTooLongError,
  EventZoneNotFoundError,
  EventZoneRequiredError,
} from "../../domain/errors/event-errors";
import { canReportEvents } from "../../domain/rules/event-permissions";
import type { EventActionState, EventFieldErrors, EventFormState, EventFormValues } from "./event-form-state";

function readValues(formData: FormData): EventFormValues {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    zoneId: String(formData.get("zoneId") ?? ""),
    addressText: String(formData.get("addressText") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
  };
}

function toDraft(values: EventFormValues): EventDraft {
  return {
    title: values.title,
    description: values.description,
    zoneId: Number(values.zoneId),
    addressText: values.addressText,
    startDate: values.startDate,
    endDate: values.endDate,
  };
}

/** Ubica el error en el campo que lo causó; si no es de un campo, va como error general. */
function toErrorState(values: EventFormValues, error: unknown): EventFormState {
  const field = (errors: EventFieldErrors): EventFormState => ({ values, errors });
  const message = actionErrorMessage(error);

  if (error instanceof EventTitleRequiredError || error instanceof EventTitleTooLongError) {
    return field({ title: message });
  }
  if (error instanceof EventZoneRequiredError || error instanceof EventZoneNotFoundError) {
    return field({ zoneId: message });
  }
  if (error instanceof EventAddressTooLongError) return field({ addressText: message });
  if (error instanceof EventStartDateRequiredError) return field({ startDate: message });
  // Fin antes del inicio: se marca el campo de fin, que es el que hay que corregir
  if (error instanceof EventEndDateRequiredError || error instanceof EventDatesOrderError) {
    return field({ endDate: message });
  }
  return { values, errors: {}, error: message };
}

/** Una acción se puede invocar con un POST directo: siempre se vuelve a mirar la sesión. */
async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function reportEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  const values = readValues(formData);
  if (!canReportEvents(await requireUser())) {
    return { values, errors: {}, error: "Inicia sesión para reportar un evento." };
  }

  let eventId: string;
  try {
    ({ id: eventId } = await eventContainer.reportEventUseCase.execute(toDraft(values)));
  } catch (error) {
    return toErrorState(values, error);
  }

  // redirect() lanza: va fuera del try para que no se tome como error
  redirect(`/events/${eventId}`);
}

export async function updateEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  const values = readValues(formData);
  // El backend decide si el usuario es el autor o un ADMIN (403 si no)
  await requireUser();

  try {
    await eventContainer.updateEventUseCase.execute(String(formData.get("eventId") ?? ""), toDraft(values));
  } catch (error) {
    return toErrorState(values, error);
  }

  refresh();
  return { values, errors: {}, success: "Cambios guardados." };
}

export async function cancelEventAction(_prev: EventActionState, formData: FormData): Promise<EventActionState> {
  await requireUser();

  try {
    await eventContainer.cancelEventUseCase.execute(String(formData.get("eventId") ?? ""));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  // El evento se conserva con estado CANCELADO: se queda en su detalle y ahí se ve el cambio
  refresh();
  return {};
}
