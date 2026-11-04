"use server";

import { redirect } from "next/navigation";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { HttpError } from "@/shared/infrastructure/http-client";
import { backendMessage } from "@/shared/presentation/action-error";
import { authContainer } from "../../di/auth.container";
import {
  EmailAlreadyRegisteredError,
  InvalidRegistrationError,
  UsernameAlreadyRegisteredError,
} from "../../domain/errors/auth-errors";
import { validateRegistration } from "../../domain/rules/registration";
import type { LoginFormState } from "./login-form-state";
import type { RegisterFormState } from "./register-form-state";

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

export async function registerAction(
  _prev: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const values = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
  };
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const errors = validateRegistration({ ...values, password });
  if (!errors.password && password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }
  if (Object.keys(errors).length > 0) return { values, errors };

  let signedIn = false;
  try {
    ({ signedIn } = await authContainer.registerUseCase.execute({ ...values, password }));
  } catch (error) {
    if (error instanceof InvalidRegistrationError) return { values, errors: error.errors };
    if (error instanceof EmailAlreadyRegisteredError) {
      return { values, errors: { email: error.message } };
    }
    if (error instanceof UsernameAlreadyRegisteredError) {
      return { values, errors: { username: error.message } };
    }
    if (error instanceof DomainError) return { values, errors: {}, error: error.message };
    if (error instanceof HttpError && error.status === 400) {
      return { values, errors: {}, error: backendMessage(error.body) };
    }
    return { values, errors: {}, error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }

  // Cuenta creada. Si el inicio de sesión automático falló, que entre desde /login.
  redirect(signedIn ? "/" : "/login");
}

export async function logoutAction(): Promise<void> {
  await authContainer.logoutUseCase.execute();
  redirect("/login");
}
