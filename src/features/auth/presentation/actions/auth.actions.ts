"use server";

import { redirect } from "next/navigation";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { HttpError } from "@/shared/infrastructure/http-client";
import { authContainer } from "../../di/auth.container";
import type { LoginFormState } from "./login-form-state";

/** message del backend NestJS: string o lista de errores de validación */
function backendMessage(body: unknown): string {
  const message = (body as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message.join(". ");
  return message ?? "Datos inválidos";
}

/** Solo se permite volver a rutas internas (evita redirecciones abiertas a otro sitio) */
function safeRedirectPath(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const twoFactorCode = String(formData.get("twoFactorCode") ?? "").trim() || undefined;
  const step = twoFactorCode !== undefined || formData.get("step") === "two-factor"
    ? "two-factor"
    : "credentials";

  if (!email || !password) {
    return { step, email, error: "Escribe tu correo y tu contraseña" };
  }
  if (step === "two-factor" && !/^\d{6}$/.test(twoFactorCode ?? "")) {
    return { step, email, error: "El código 2FA tiene 6 dígitos" };
  }

  try {
    const result = await authContainer.loginUseCase.execute({ email, password, twoFactorCode });
    if (result.kind === "two-factor-required") {
      return { step: "two-factor", email };
    }
  } catch (error) {
    if (error instanceof DomainError) {
      return { step, email, error: error.message };
    }
    // 400 de validación del backend: se muestra su mensaje
    if (error instanceof HttpError && error.status === 400) {
      return { step, email, error: backendMessage(error.body) };
    }
    return { step, email, error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }

  // redirect() lanza una excepción especial: debe ir fuera del try/catch
  redirect(safeRedirectPath(formData.get("from")));
}

export async function logoutAction(): Promise<void> {
  await authContainer.logoutUseCase.execute();
  redirect("/login");
}
