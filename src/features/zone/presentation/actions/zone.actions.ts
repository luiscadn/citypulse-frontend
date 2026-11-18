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

/**
 * Función auxiliar readValues
 *
 * - **¿Qué hace?**: Extrae las cadenas de texto correspondientes a `name`, `description` y `parentZoneId` desde `FormData`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada al inicio de `createZoneAction` y `updateZoneAction`.
 * - **¿Cuál es su importancia?**: Centraliza la extracción de campos del formulario con valores por defecto seguros (`""`).
 */
function readValues(formData: FormData): ZoneFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    parentZoneId: String(formData.get("parentZoneId") ?? ""),
  };
}

/**
 * Función auxiliar toDraft
 *
 * - **¿Qué hace?**: Convierte los `ZoneFormValues` en un `ZoneDraft`, transformando `parentZoneId` a número o `null`.
 * - **¿Cómo interactúa con el sistema en general?**: Es el puente entre los valores del formulario y los casos de uso.
 * - **¿Cuál es su importancia?**: Prepara la estructura requerida por las reglas de dominio.
 */
function toDraft(values: ZoneFormValues): ZoneDraft {
  return {
    name: values.name,
    description: values.description,
    parentZoneId: values.parentZoneId ? Number(values.parentZoneId) : null,
  };
}

/**
 * Función auxiliar toErrorState
 *
 * - **¿Qué hace?**: Inspecciona el tipo de error capturado y lo mapea al campo específico del formulario que lo originó
 *   (ej. `ZoneNameTakenError` a `errors.name`, `ZoneSelfParentError` a `errors.parentZoneId`). Si no es de un campo específico,
 *   lo asigna como error general (`error`).
 * - **¿Cómo interactúa con el sistema en general?**: Alimenta el retorno de error de las Server Actions de zonas.
 * - **¿Cuál es su importancia?**: Proporciona retroalimentación contextual precisa en la UI, marcando en rojo exactamente
 *   el input causante del problema.
 */
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

/**
 * Función auxiliar requireAdmin
 *
 * - **¿Qué hace?**: Verifica que exista una sesión activa y que el usuario cuente con rol `ADMIN`.
 *   Si no hay sesión, redirige a `/login`; si no es admin, retorna `false`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta al inicio de cada Server Action de zonas.
 * - **¿Cuál es su importancia?**: Garantiza seguridad en el servidor: aunque un atacante eluda la UI y envíe
 *   un POST directo a la Server Action, la mutación es rechazada categóricamente.
 */
async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return canManageZones(user);
}

/**
 * Server Action: createZoneAction
 *
 * - **¿Qué hace?**: Procesa el envío del formulario de creación de zonas. Valida permisos de administrador,
 *   ejecuta `createZoneUseCase`, purga y revalida la caché de la página con `refresh()`, y retorna un estado
 *   con el formulario limpio y mensaje de éxito.
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza a `ZoneForm` mediante `useActionState`.
 * - **¿Cuál es su importancia?**: Punto de entrada de mutación para la creación de zonas en Next.js App Router.
 */
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

/**
 * Server Action: updateZoneAction
 *
 * - **¿Qué hace?**: Procesa la edición de una zona existente. Verifica rol de administrador, ejecuta `updateZoneUseCase`,
 *   revalida la caché con `refresh()`, y devuelve el estado actualizado con mensaje de éxito.
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza a `ZoneForm` en modo edición desde la vista `ZoneDetail`.
 * - **¿Cuál es su importancia?**: Permite modificar metadatos y jerarquías territoriales con retroalimentación instantánea.
 */
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

/**
 * Server Action: deleteZoneAction
 *
 * - **¿Qué hace?**: Procesa la eliminación permanente de una zona. Verifica rol de administrador, invoca `deleteZoneUseCase`,
 *   y tras el éxito redirige al listado `/zones`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde el formulario interactivo `DeleteZoneButton`.
 * - **¿Cuál es su importancia?**: Asegura que `redirect("/zones")` se ejecute fuera del bloque `try/catch`
 *   (para no interceptar la excepción interna que Next.js utiliza para redirigir) y entrega errores legibles si la zona está en uso.
 */
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
