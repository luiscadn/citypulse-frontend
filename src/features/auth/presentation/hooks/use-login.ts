"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/auth.actions";
import { initialLoginState } from "../actions/login-form-state";

/**
 * Hook fachada para el flujo de autenticación e inicio de sesión.
 *
 * - **¿Qué hace?**: Vincula la Server Action `loginAction` con `useActionState`, manejando tanto el primer paso
 *   (correo y contraseña) como el segundo factor condicional TOTP (`askCode`), exponiendo el estado (`state`),
 *   el despachador del formulario (`formAction`) y la transición en curso (`pending`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el formulario `LoginForm` en la ruta `/login`.
 * - **¿Cuál es su importancia?**: Simplifica la máquina de estados de autenticación de dos pasos en el cliente,
 *   evitando que el componente visual gestione estados manuales de transición.
 */
export function useLogin() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);
  return { state, formAction, pending, askCode: state.step === "two-factor" };
}
