/**
 * @file venue.actions.ts
 * @description Server Actions para la gestión de Lugares (Venues) en Next.js App Router.
 * Ejecutadas exclusivamente en el servidor (`use server`), manejan autenticación,
 * autorización previa, invocación de casos de uso y revalidación de caché.
 */

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

/**
 * Extrae los valores como strings desde un objeto `FormData`.
 */
function readValues(formData: FormData): VenueFormValues {
  return {
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    zoneId: String(formData.get("zoneId") ?? ""),
  };
}

/**
 * Convierte los valores de formulario en un borrador de dominio `VenueDraft`.
 */
function toDraft(values: VenueFormValues): VenueDraft {
  return {
    name: values.name,
    address: values.address,
    description: values.description,
    zoneId: Number(values.zoneId),
  };
}

/**
 * Mapea errores de dominio a los campos de formulario específicos o como error general.
 *
 * - **¿Qué hace?**: Identifica el tipo de error de dominio y lo asigna a la propiedad correspondiente (`name`, `address`, `description`, `zoneId`).
 * - **¿Cómo interactúa con el sistema en general?**: Retorna el nuevo `VenueFormState` para que React 19 actualice la vista sin recargar la página.
 * - **¿Cuál es su importancia?**: Brinda retroalimentación visual granular y accesible directamente en el input que originó la falla.
 */
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

/**
 * Comprueba que exista un usuario autenticado o redirige al login.
 *
 * - **¿Qué hace?**: Obtiene la sesión actual desde las cookies cifradas. Si no hay sesión, interrumpe el flujo con `redirect("/login")`.
 * - **¿Cómo interactúa con el sistema en general?**: Función de guardia ejecutada al inicio de cada acción de servidor.
 * - **¿Cuál es su importancia?**: Previene invocaciones no autorizadas vía peticiones HTTP POST directas.
 */
async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Server Action para registrar un nuevo lugar.
 *
 * - **¿Qué hace?**:
 *   Verifica la sesión y rol OWNER (`canRegisterVenues`), ejecuta `createVenueUseCase` y redirige
 *   a la página de detalle `/venues/[id]` del lugar creado.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Conectada al formulario `VenueForm` cuando está en modo creación.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura el registro seguro de establecimientos físicos, redirigiendo de inmediato al usuario para ver su nuevo venue.
 */
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

  // redirect() lanza una excepción interna de Next.js: se ubica fuera del bloque try/catch
  redirect(`/venues/${venueId}`);
}

/**
 * Server Action para actualizar la información de un lugar existente.
 *
 * - **¿Qué hace?**:
 *   Verifica la autenticación, ejecuta `updateVenueUseCase`, invalida la caché de Next.js con `refresh()`,
 *   y retorna un mensaje informativo indicando si el lugar continuó verificado o si volvió a quedar pendiente.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Conectada al formulario `VenueForm` cuando recibe un venue existente en modo edición.
 *
 * - **¿Cuál es su importancia?**:
 *   Mantiene informados a los dueños de locales sobre el impacto de sus modificaciones en el estado de certificación oficial.
 */
export async function updateVenueAction(_prev: VenueFormState, formData: FormData): Promise<VenueFormState> {
  const values = readValues(formData);
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

/**
 * Server Action para eliminar un lugar.
 *
 * - **¿Qué hace?**:
 *   Verifica la sesión, invoca `deleteVenueUseCase` con el ID del formulario y redirige al listado
 *   adecuado (`/venues/mine` si es OWNER, `/venues` si es ADMIN).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada por `DeleteVenueButton` tras la confirmación del usuario.
 *
 * - **¿Cuál es su importancia?**:
 *   Limpia el catálogo con redirección inteligente según el rol del usuario que efectuó la eliminación.
 */
export async function deleteVenueAction(_prev: VenueActionState, formData: FormData): Promise<VenueActionState> {
  const user = await requireUser();

  try {
    await venueContainer.deleteVenueUseCase.execute(Number(formData.get("venueId")));
  } catch (error) {
    return { error: actionErrorMessage(error) };
  }

  redirect(canRegisterVenues(user) ? "/venues/mine" : "/venues");
}

/**
 * Server Action para certificar y verificar administrativamente un lugar.
 *
 * - **¿Qué hace?**:
 *   Comprueba que el usuario sea administrador (`canVerifyVenues`), ejecuta `verifyVenueUseCase`
 *   y refresca la vista del servidor con `refresh()`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada por el componente `VerifyVenueButton`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que únicamente administradores autorizados puedan marcar un local como verificado.
 */
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
