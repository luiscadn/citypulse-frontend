"use client";

import { useActionState } from "react";
import { registerAction } from "../actions/auth.actions";
import { initialRegisterState } from "../actions/register-form-state";

/**
 * Hook fachada para el registro de nuevos usuarios en la plataforma.
 *
 * - **¿Qué hace?**: Enlaza `registerAction` con `useActionState`, inicializando el estado con `initialRegisterState`
 *   y proveyendo `state`, `formAction` y el indicador de carga `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el formulario `RegisterForm` en la ruta `/register`.
 * - **¿Cuál es su importancia?**: Aísla la Server Action de creación de cuentas de la representación visual del formulario.
 */
export function useRegister() {
  const [state, formAction, pending] = useActionState(registerAction, initialRegisterState);
  return { state, formAction, pending };
}
