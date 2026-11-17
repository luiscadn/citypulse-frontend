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

/** "" es "sin dato"; cualquier otro texto se convierte y lo valida el dominio. */
const optionalNumber = (value: string) => (value.trim() === "" ? null : Number(value));

/** Ubica el error en el campo que lo causó; si no es de un campo, va como error general. */
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
