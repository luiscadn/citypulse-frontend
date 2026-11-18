/**
 * @file register-form-state.ts
 * @description Tipos y estados auxiliares para el formulario de registro comunitario (useActionState).
 */

import type { RegistrationErrors } from "../../domain/rules/registration";

/**
 * Estado del formulario de registro devuelto por `registerAction`.
 *
 * - **¿Qué hace?**:
 *   Preserva los valores no confidenciales ingresados (`fullName`, `username`, `email`),
 *   los errores específicos por campo (`errors`) y posibles errores generales (`error`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Retornado por `registerAction` y consumido por `useActionState` en `RegisterForm`.
 *
 * - **¿Cuál es su importancia?**:
 *   Evita que el usuario deba reescribir toda su información si una validación falla, excluyendo contraseñas por seguridad.
 */
export interface RegisterFormState {
  values: { fullName: string; username: string; email: string };
  errors: RegistrationErrors;
  error?: string;
}

/** Estado inicial limpio para el formulario de registro. */
export const initialRegisterState: RegisterFormState = {
  values: { fullName: "", username: "", email: "" },
  errors: {},
};
