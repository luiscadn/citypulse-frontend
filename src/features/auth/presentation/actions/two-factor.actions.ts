/**
 * @file two-factor.actions.ts
 * @description Server Actions para la administración de la Verificación en Dos Pasos (2FA) en Next.js.
 */

"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import type { ActionResult } from "@/shared/presentation/action-result";
import { authContainer } from "../../di/auth.container";
import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";

const PROFILE_PATH = "/profile";

/**
 * Server Action para iniciar la configuración de 2FA.
 *
 * - **¿Qué hace?**: Genera un nuevo secreto y código QR mediante `setupTwoFactorUseCase` y los devuelve en un `ActionResult`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada por `TwoFactorPanel`.
 * - **¿Cuál es su importancia?**: Proporciona los datos requeridos para la sincronización con la app autenticadora.
 */
export async function startTwoFactorAction(): Promise<ActionResult<TwoFactorSetup>> {
  try {
    return { ok: true, data: await authContainer.setupTwoFactorUseCase.execute() };
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }
}

/**
 * Server Action para habilitar definitivamente la verificación en dos pasos tras verificar un código TOTP.
 *
 * - **¿Qué hace?**: Envía el código a `enableTwoFactorUseCase` y revalida la ruta `/profile`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada al confirmar el código en `TwoFactorPanel`.
 * - **¿Cuál es su importancia?**: Activa formalmente la protección multifactor en la cuenta del usuario.
 */
export async function enableTwoFactorAction(code: string): Promise<ActionResult> {
  try {
    await authContainer.enableTwoFactorUseCase.execute(code);
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }
  revalidatePath(PROFILE_PATH);
  return { ok: true, data: undefined };
}

/**
 * Server Action para deshabilitar la verificación en dos pasos.
 *
 * - **¿Qué hace?**: Remueve la protección 2FA en el backend y refresca la caché de `/profile`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada al deshabilitar el 2FA en `TwoFactorPanel`.
 * - **¿Cuál es su importancia?**: Permite revertir la configuración multifactor de forma segura.
 */
export async function disableTwoFactorAction(): Promise<ActionResult> {
  try {
    await authContainer.disableTwoFactorUseCase.execute();
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }
  revalidatePath(PROFILE_PATH);
  return { ok: true, data: undefined };
}
