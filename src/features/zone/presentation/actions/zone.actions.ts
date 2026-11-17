"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { zoneContainer } from "../../di/zone.container";
import type { ZoneDraft } from "../../domain/entities/zone";
import {
  ZoneDescriptionTooLongError,
  ZoneNameRequiredError,
  ZoneNameTakenError,
  ZoneNameTooLongError,
  ZoneParentNotFoundError,
  ZoneSelfParentError,
} from "../../domain/errors/zone-errors";
import { canManageZones } from "../../domain/rules/zone-permissions";
import {
  emptyZoneFormValues,
  type DeleteZoneState,
  type ZoneFieldErrors,
  type ZoneFormState,
  type ZoneFormValues,
} from "./zone-form-state";

const NOT_ADMIN = "Solo un administrador puede gestionar zonas.";

function readValues(formData: FormData): ZoneFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    parentZoneId: String(formData.get("parentZoneId") ?? ""),
  };
}

function toDraft(values: ZoneFormValues): ZoneDraft {
  return {
    name: values.name,
    description: values.description,
    parentZoneId: values.parentZoneId ? Number(values.parentZoneId) : null,
  };
}

/** Ubica el error en el campo que lo causó; si no es de un campo, va como error general. */
function toErrorState(values: ZoneFormValues, error: unknown): ZoneFormState {
  const field = (errors: ZoneFieldErrors): ZoneFormState => ({ values, errors });
  const message = actionErrorMessage(error);

  if (
    error instanceof ZoneNameRequiredError ||
    error instanceof ZoneNameTooLongError ||
    error instanceof ZoneNameTakenError
  ) {
    return field({ name: message });
  }
  if (error instanceof ZoneDescriptionTooLongError) return field({ description: message });
  if (error instanceof ZoneSelfParentError || error instanceof ZoneParentNotFoundError) {
    return field({ parentZoneId: message });
  }
  return { values, errors: {}, error: message };
}

/** Una acción se puede invocar con un POST directo: no basta con ocultar el formulario. */
async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return canManageZones(user);
}

export async function createZoneAction(_prev: ZoneFormState, formData: FormData): Promise<ZoneFormState> {
  const values = readValues(formData);
  if (!(await requireAdmin())) return { values, errors: {}, error: NOT_ADMIN };

  let name: string;
  try {
    ({ name } = await zoneContainer.createZoneUseCase.execute(toDraft(values)));
  } catch (error) {
    return toErrorState(values, error);
  }

  refresh();
  // El formulario queda limpio para crear otra
  return { values: emptyZoneFormValues, errors: {}, success: `Zona "${name}" creada.` };
}

export async function updateZoneAction(_prev: ZoneFormState, formData: FormData): Promise<ZoneFormState> {
  const values = readValues(formData);
  if (!(await requireAdmin())) return { values, errors: {}, error: NOT_ADMIN };

  const zoneId = Number(formData.get("zoneId"));
  try {
    await zoneContainer.updateZoneUseCase.execute(zoneId, toDraft(values));
  } catch (error) {
    return toErrorState(values, error);
  }

  refresh();
  // La zona padre no se puede quitar, así que tras guardar el selector vuelve a "sin cambiar"
  return { values: { ...values, parentZoneId: "" }, errors: {}, success: "Cambios guardados." };
}

export async function deleteZoneAction(_prev: DeleteZoneState, formData: FormData): Promise<DeleteZoneState> {
  if (!(await requireAdmin())) return { error: NOT_ADMIN };

  try {
    await zoneContainer.deleteZoneUseCase.execute(Number(formData.get("zoneId")));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  // redirect() lanza: va fuera del try para que no se tome como error
  redirect("/zones");
}
