"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/auth.actions";
import { initialLoginState } from "../actions/login-form-state";

/** Hook fachada del inicio de sesión (correo y contraseña, y luego el código 2FA si aplica). */
export function useLogin() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);
  return { state, formAction, pending, askCode: state.step === "two-factor" };
}
