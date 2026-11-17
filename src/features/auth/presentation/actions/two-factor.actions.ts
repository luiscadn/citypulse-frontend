"use server";

import { revalidatePath } from "next/cache";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import type { ActionResult } from "@/shared/presentation/action-result";
import { authContainer } from "../../di/auth.container";
import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";

/** Tras cambiar el 2FA se refresca el perfil, que muestra su estado. */
const PROFILE_PATH = "/profile";

export async function startTwoFactorAction(): Promise<ActionResult<TwoFactorSetup>> {
  try {
    return { ok: true, data: await authContainer.setupTwoFactorUseCase.execute() };
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }
}

export async function enableTwoFactorAction(code: string): Promise<ActionResult> {
  try {
    await authContainer.enableTwoFactorUseCase.execute(code);
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }
  revalidatePath(PROFILE_PATH);
  return { ok: true, data: undefined };
}

export async function disableTwoFactorAction(): Promise<ActionResult> {
  try {
    await authContainer.disableTwoFactorUseCase.execute();
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) };
  }
  revalidatePath(PROFILE_PATH);
  return { ok: true, data: undefined };
}