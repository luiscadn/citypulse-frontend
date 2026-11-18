"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { venueContainer } from "@/features/venue/di/venue.container";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { eventContainer } from "../../di/event.container";
import {
  EventAddressTooLongError,
  EventCapacityError,
  EventDatesOrderError,
  EventEndDateRequiredError,
  EventStartDateRequiredError,
  EventTicketPriceError,
  EventTitleRequiredError,
  EventTitleTooLongError,
  EventVisibilityError,
  OfficialVenueForbiddenError,
  OfficialVenueRequiredError,
} from "../../domain/errors/event-errors";
import { canPublishOfficialEvents } from "../../domain/rules/event-permissions";
import type {
  OfficialEventFieldErrors,
  OfficialEventFormState,
  OfficialEventFormValues,
} from "./event-form-state";

/**
 * Lee y extrae los campos textuales del formulario de publicación de evento oficial.
 *
 * - **¿Qué hace?**: Mapea los valores recibidos en `FormData` (`title`, `description`, `addressText`,
 *   `startDate`, `endDate`, `venueId`, `visibility`, `capacity`, `ticketPrice`) a una estructura tipada.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada al inicio de `publishOfficialEventAction`.
 * - **¿Cuál es su importancia?**: Centraliza la captura de inputs HTML asegurando que no existan valores `null`.
 */
function readValues(formData: FormData): OfficialEventFormValues {
  const text = (name: string) => String(formData.get(name) ?? "");
  return {
    title: text("title"),
    description: text("description"),
    addressText: text("addressText"),
    startDate: text("startDate"),
    endDate: text("endDate"),
    venueId: text("venueId"),
    visibility: text("visibility"),
    capacity: text("capacity"),
    ticketPrice: text("ticketPrice"),
  };
}

/**
 * Parsea un número opcional ingresado en un formulario web.
 *
 * - **¿Qué hace?**: Devuelve `null` si el texto recortado está vacío; de lo contrario, lo castea a `Number`.
 * - **¿Cómo interactúa con el sistema en general?**: Usado para procesar campos numéricos opcionales como `capacity` o `ticketPrice`.
 * - **¿Cuál es su importancia?**: Evita que cadenas vacías se conviertan accidentalmente en `0` antes de pasar por las reglas de validación.
 */
const optionalNumber = (value: string) => (value.trim() === "" ? null : Number(value));

/**
 * Transforma una excepción de dominio en un estado de error granular por campo.
 *
 * - **¿Qué hace?**: Evalúa la clase de error lanzada durante la validación del evento oficial y asigna el mensaje
 *   al campo del formulario correspondiente (`title`, `venueId`, `addressText`, `startDate`, `endDate`, etc.).
 * - **¿Cómo interactúa con el sistema en general?**: Provee el estado `OfficialEventFormState` consumido por `OfficialEventForm`.
 * - **¿Cuál es su importancia?**: Muestra los mensajes de validación justo al lado del input que causó el fallo, guiando al usuario.
 */
function toErrorState(values: OfficialEventFormValues, error: unknown): OfficialEventFormState {
  const field = (errors: OfficialEventFieldErrors): OfficialEventFormState => ({ values, errors });
  const message = actionErrorMessage(error);

  if (error instanceof EventTitleRequiredError || error instanceof EventTitleTooLongError) {
    return field({ title: message });
  }
  if (error instanceof OfficialVenueRequiredError || error instanceof OfficialVenueForbiddenError) {
    return field({ venueId: message });
  }
  if (error instanceof EventAddressTooLongError) return field({ addressText: message });
  if (error instanceof EventStartDateRequiredError) return field({ startDate: message });
  if (error instanceof EventEndDateRequiredError || error instanceof EventDatesOrderError) {
    return field({ endDate: message });
  }
  if (error instanceof EventVisibilityError) return field({ visibility: message });
  if (error instanceof EventCapacityError) return field({ capacity: message });
  if (error instanceof EventTicketPriceError) return field({ ticketPrice: message });
  return { values, errors: {}, error: message };
}

/**
 * Server Action: Publicar Evento Oficial en un Recinto Propio
 *
 * - **¿Qué hace?**: Valida la sesión activa y los permisos (`canPublishOfficialEvents`), verifica que el lugar
 *   elegido pertenezca al usuario autenticado, ejecuta `publishOfficialEventUseCase.execute` y redirige
 *   a la página de detalle del nuevo evento (`/events/[id]`).
 * - **¿Cómo interactúa con el sistema en general?**: Conecta el formulario `OfficialEventForm` y su hook
 *   `useOfficialEventForm` con los casos de uso de eventos y recintos.
 * - **¿Cuál es su importancia?**: Aplica autorización estricta en el servidor evitando que un usuario publique
 *   eventos en recintos que no le pertenecen (Broken Object Level Authorization - BOLA).
 */
export async function publishOfficialEventAction(
  _prev: OfficialEventFormState,
  formData: FormData,
): Promise<OfficialEventFormState> {
  const values = readValues(formData);
  // Una acción se puede invocar con un POST directo: siempre se vuelve a mirar la sesión
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canPublishOfficialEvents(user)) {
    return { values, errors: {}, error: "Solo un propietario o un administrador publica eventos oficiales." };
  }

  let eventId: string;
  try {
    // La zona del evento es la del lugar: solo se aceptan lugares propios
    const venueId = Number(values.venueId);
    const venue = values.venueId
      ? (await venueContainer.listMyVenuesUseCase.execute()).find((mine) => mine.id === venueId)
      : undefined;
    if (values.venueId && !venue) throw new OfficialVenueForbiddenError();

    ({ id: eventId } = await eventContainer.publishOfficialEventUseCase.execute({
      title: values.title,
      description: values.description,
      addressText: values.addressText,
      startDate: values.startDate,
      endDate: values.endDate,
      zoneId: venue?.zone.id ?? 0,
      venueId: venue?.id ?? 0,
      visibility: values.visibility,
      capacity: optionalNumber(values.capacity),
      ticketPrice: optionalNumber(values.ticketPrice),
    }));
  } catch (error) {
    return toErrorState(values, error);
  }

  // redirect() lanza: va fuera del try para que no se tome como error
  redirect(`/events/${eventId}`);
}
