/**
 * @file auth.actions.ts
 * @description Server Actions para el inicio de sesión, registro comunitario y cierre de sesión en Next.js App Router.
 * Ejecutadas en el servidor (`use server`), manejan redirecciones seguras y flujos multifactor.
 */

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

/**
 * Sanea y valida que la ruta de retorno sea una ruta interna de la aplicación.
 *
 * - **¿Qué hace?**: Comprueba que la cadena comience con `/` y no con `//` para prevenir ataques de Redirección Abierta (Open Redirect).
 */
function safeRedirectPath(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "";
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

/**
 * Server Action para iniciar sesión con soporte para 2FA.
 *
 * - **¿Qué hace?**:
 *   Extrae credenciales del `FormData`, valida formato preliminar, ejecuta `loginUseCase`,
 *   y si el backend responde `two-factor-required`, actualiza el estado para solicitar el código TOTP.
 *   Si la autenticación culmina exitosamente, redirige a la ruta original solicitada (`from`) o a `/`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocada por `LoginForm` mediante `useActionState`.
 *
 * - **¿Cuál es su importancia?**:
 *   Controla el flujo de autenticación primario y secundario en una única acción unificada y segura.
 */
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
    if (error instanceof HttpError && error.status === 400) {
      return { step, email, error: backendMessage(error.body) };
    }
    return { step, email, error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }

  redirect(safeRedirectPath(formData.get("from")));
}

/**
 * Server Action para el registro comunitario de nuevas cuentas.
 *
 * - **¿Qué hace?**:
 *   Valida los campos y la concordancia de contraseñas, invoca `registerUseCase` para dar de alta la cuenta
 *   e iniciar sesión automáticamente, y redirige a la página principal (`/`) o al login (`/login`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Conectada a `RegisterForm` mediante `useActionState`.
 *
 * - **¿Cuál es su importancia?**:
 *   Mapea los errores de validación y de conflicto directamente sobre los campos visuales correspondientes.
 */
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

  redirect(signedIn ? "/" : "/login");
}

/**
 * Server Action para cerrar la sesión del usuario actual.
 *
 * - **¿Qué hace?**: Invoca `logoutUseCase` para destruir la cookie segura y redirige a `/login`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada por `LogoutButton` en el menú de navegación.
 * - **¿Cuál es su importancia?**: Asegura la terminación inmediata del estado de autenticación.
 */
export async function logoutAction(): Promise<void> {
  await authContainer.logoutUseCase.execute();
  redirect("/login");
}
