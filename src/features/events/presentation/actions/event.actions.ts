/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: SERVER ACTIONS, REPORTEVENTACTION, UPDATEEVENTACTION,
 * CANCELEVENTACTION, REVALIDATE, REFRESH DE CACHÉ, MUTACIONES DE EVENTOS, FORMDATA
 * =================================================================================================
 *
 * @file event.actions.ts
 * @description Server Actions para la gestión de Eventos y reportes ciudadanos en Next.js App Router.
 * Ejecutadas en el entorno seguro del servidor (`use server`), manejan autenticación,
 * autorización, ejecución de casos de uso y refresco de caché con `refresh()`.
 */

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

/**
 * Lee y extrae como strings los valores desde el FormData enviado por el formulario.
 */
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

/**
 * Transforma los valores de formulario en un borrador de dominio `EventDraft`.
 */
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

/**
 * Mapea errores de dominio al campo específico del formulario o como error global.
 *
 * - **¿Qué hace?**: Asigna el mensaje de error al campo que causó la infracción (`title`, `zoneId`, `addressText`, `startDate`, `endDate`).
 * - **¿Cómo interactúa con el sistema en general?**: Retorna el nuevo estado de formulario procesado por `useActionState` en React 19.
 * - **¿Cuál es su importancia?**: Brinda retroalimentación visual amigable y contextualizada sin recargar la página.
 */
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
  if (error instanceof EventEndDateRequiredError || error instanceof EventDatesOrderError) {
    return field({ endDate: message });
  }
  return { values, errors: {}, error: message };
}

/**
 * Comprueba que el usuario tenga una sesión válida en el servidor o lo redirige al login.
 */
async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Server Action para reportar un nuevo evento comunitario.
 *
 * - **¿Qué hace?**:
 *   Verifica la sesión activa (`canReportEvents`), ejecuta `reportEventUseCase` y redirige
 *   a la página de detalle `/events/[id]` del nuevo reporte creado.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada desde el formulario en la ruta `/events/new`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite a la ciudadanía registrar eventos comunitarios de manera ágil con redirección instantánea.
 */
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

  redirect(`/events/${eventId}`);
}

/**
 * Server Action para actualizar un reporte de evento en revisión.
 *
 * - **¿Qué hace?**:
 *   Verifica la sesión, ejecuta `updateEventUseCase`, invalida la caché con `refresh()`
 *   y devuelve un mensaje de éxito.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada desde `EventForm` en la vista de detalle cuando el evento sigue en estado `REPORTADO`.
 *
 * - **¿Cuál es su importancia?**:
 *   Facilita la corrección de datos en eventos antes de su confirmación administrativa definitiva.
 */
export async function updateEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  const values = readValues(formData);
  await requireUser();

  try {
    await eventContainer.updateEventUseCase.execute(String(formData.get("eventId") ?? ""), toDraft(values));
  } catch (error) {
    return toErrorState(values, error);
  }

  refresh();
  return { values, errors: {}, success: "Cambios guardados." };
}

/**
 * Server Action para cancelar un evento.
 *
 * - **¿Qué hace?**:
 *   Verifica la sesión, invoca `cancelEventUseCase` y refresca los datos de la página actual con `refresh()`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada por `CancelEventButton` en `EventDetail`.
 *
 * - **¿Cuál es su importancia?**:
 *   Mantiene actualizado el estado del evento sin desubicar al usuario de la página en la que se encuentra.
 */
export async function cancelEventAction(_prev: EventActionState, formData: FormData): Promise<EventActionState> {
  await requireUser();

  try {
    await eventContainer.cancelEventUseCase.execute(String(formData.get("eventId") ?? ""));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  refresh();
  return {};
}
