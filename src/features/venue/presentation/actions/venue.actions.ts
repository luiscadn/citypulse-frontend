"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import type { SessionUser } from "@/features/auth/domain/entities/session-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { venueContainer } from "../../di/venue.container";
import type { VenueDraft } from "../../domain/entities/venue";
import {
  VenueAddressRequiredError,
  VenueAddressTooLongError,
  VenueDescriptionTooLongError,
  VenueNameRequiredError,
  VenueNameTakenError,
  VenueNameTooLongError,
  VenueZoneNotFoundError,
  VenueZoneRequiredError,
} from "../../domain/errors/venue-errors";
import { canRegisterVenues, canVerifyVenues } from "../../domain/rules/venue-permissions";
import type {
  VenueActionState,
  VenueFieldErrors,
  VenueFormState,
  VenueFormValues,
} from "./venue-form-state";

function readValues(formData: FormData): VenueFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    zoneId: String(formData.get("zoneId") ?? ""),
    latitude: String(formData.get("latitude") ?? ""),
    longitude: String(formData.get("longitude") ?? ""),
  };
}

// Number("") es 0: un campo vacío tiene que quedar como "sin ubicación"
function toCoordinate(value: string): number | null {
  return value.trim() === "" ? null : Number(value);
}

function toDraft(values: VenueFormValues): VenueDraft {
  return {
    name: values.name,
    address: values.address,
    description: values.description,
    zoneId: Number(values.zoneId),
    latitude: toCoordinate(values.latitude),
    longitude: toCoordinate(values.longitude),
  };
}

/** Ubica el error en el campo que lo causó; si no es de un campo, va como error general. */
function toErrorState(values: VenueFormValues, error: unknown): VenueFormState {
  const field = (errors: VenueFieldErrors): VenueFormState => ({ values, errors });
  const message = actionErrorMessage(error);

  if (
    error instanceof VenueNameRequiredError ||
    error instanceof VenueNameTooLongError ||
    error instanceof VenueNameTakenError
  ) {
    return field({ name: message });
  }
  if (error instanceof VenueAddressRequiredError || error instanceof VenueAddressTooLongError) {
    return field({ address: message });
  }
  if (error instanceof VenueDescriptionTooLongError) return field({ description: message });
  if (error instanceof VenueZoneRequiredError || error instanceof VenueZoneNotFoundError) {
    return field({ zoneId: message });
  }
  return { values, errors: {}, error: message };
}

/** Una acción se puede invocar con un POST directo: siempre se vuelve a mirar la sesión. */
async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function createVenueAction(_prev: VenueFormState, formData: FormData): Promise<VenueFormState> {
  const values = readValues(formData);
  if (!canRegisterVenues(await requireUser())) {
    return { values, errors: {}, error: "Solo los dueños de lugares (OWNER) pueden registrarlos." };
  }

  let venueId: number;
  try {
    ({ id: venueId } = await venueContainer.createVenueUseCase.execute(toDraft(values)));
  } catch (error) {
    return toErrorState(values, error);
  }

  // redirect() lanza: va fuera del try para que no se tome como error
  redirect(`/venues/${venueId}`);
}

export async function updateVenueAction(_prev: VenueFormState, formData: FormData): Promise<VenueFormState> {
  const values = readValues(formData);
  // El backend decide si el usuario es el dueño o un ADMIN (403 si no)
  await requireUser();

  let stillVerified: boolean;
  try {
    const venue = await venueContainer.updateVenueUseCase.execute(Number(formData.get("venueId")), toDraft(values));
    stillVerified = venue.isVerified;
  } catch (error) {
    return toErrorState(values, error);
  }

  refresh();
  return {
    values,
    errors: {},
    success: stillVerified
      ? "Cambios guardados."
      : "Cambios guardados. El lugar queda pendiente de que un administrador lo verifique.",
  };
}

export async function deleteVenueAction(_prev: VenueActionState, formData: FormData): Promise<VenueActionState> {
  const user = await requireUser();

  try {
    await venueContainer.deleteVenueUseCase.execute(Number(formData.get("venueId")));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  // El OWNER vuelve a sus lugares; el ADMIN, al listado general
  redirect(canRegisterVenues(user) ? "/venues/mine" : "/venues");
}

export async function verifyVenueAction(_prev: VenueActionState, formData: FormData): Promise<VenueActionState> {
  if (!canVerifyVenues(await requireUser())) {
    return { error: "Solo un administrador puede verificar lugares." };
  }

  try {
    await venueContainer.verifyVenueUseCase.execute(Number(formData.get("venueId")));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  refresh();
  return {};
}
