/**
 * @file profile.actions.ts
 * @description Server Actions para la actualización del perfil del usuario autenticado en Next.js App Router.
 * Ejecutada en el entorno seguro del servidor (`use server`), maneja validación, autorización y revalidación de caché.
 */

"use server";

import { revalidatePath } from "next/cache";
import type { AuthUser } from "@/shared/domain/auth-user";
import { HttpError } from "@/shared/infrastructure/http-client";
import { getSessionToken } from "@/shared/infrastructure/session/session-cookie";
import { readValidJwt } from "@/shared/infrastructure/session/jwt";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { usersContainer } from "../../di/users.container";
import { validateProfile } from "../../domain/rules/profile";
import type { UpdateUserParams } from "../../domain/entities/user";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "../../domain/errors/user-errors";
import type { ProfileFormState } from "./profile-form-state";

/**
 * Server Action para actualizar los datos personales (nombre completo y username) del usuario actual.
 *
 * - **¿Qué hace?**:
 *   Extrae los valores de `FormData`, valida mediante `validateProfile`, obtiene el token JWT de la sesión
 *   para garantizar la identidad del usuario solicitante, compara contra los datos actuales para evitar mutaciones redundantes,
 *   invoca `updateUser` en el contenedor, maneja colisiones de username y finalmente revalida la ruta `/profile`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Conectada directamente al formulario `ProfileForm` en la pantalla `/profile`.
 *
 * - **¿Cuál es su importancia?**:
 *   Seguridad: el ID del usuario modificado proviene estrictamente del JWT de la cookie HTTP-only y nunca
 *   de un campo manipulable por el cliente en el formulario.
 */
export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const values = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
  };

  const errors = validateProfile(values);
  if (Object.keys(errors).length > 0) return { values, errors };

  const session = readValidJwt(await getSessionToken());
  if (!session) {
    return { values, errors: {}, error: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  try {
    const me = await usersContainer.getUser(session.sub);
    const requester: AuthUser = { id: me.id, email: me.email, username: me.username, roles: me.roles };

    const changes: UpdateUserParams = {};
    if (values.fullName !== me.fullName) changes.fullName = values.fullName;
    if (values.username !== me.username) changes.username = values.username;
    if (Object.keys(changes).length === 0) {
      return { values, errors: {}, success: "No hay cambios que guardar." };
    }

    await usersContainer.updateUser(me.id, changes, requester);
  } catch (error) {
    if (error instanceof UsernameAlreadyInUseError || error instanceof EmailAlreadyInUseError) {
      return { values, errors: { username: "Este nombre de usuario ya está en uso" } };
    }
    if (error instanceof HttpError && error.status >= 500) {
      return {
        values,
        errors: {},
        error: "No se pudo guardar. Si cambiaste el nombre de usuario, puede que ya esté en uso.",
      };
    }
    return { values, errors: {}, error: actionErrorMessage(error) };
  }

  revalidatePath("/profile");
  return { values, errors: {}, success: "Cambios guardados." };
}
