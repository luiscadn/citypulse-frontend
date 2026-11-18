/**
 * @file login-form-state.ts
 * @description Tipos y estados auxiliares para el formulario de inicio de sesión multifactor (useActionState).
 */

/**
 * Estado del formulario de login devuelto por `loginAction`.
 *
 * - **¿Qué hace?**:
 *   Controla la etapa actual del flujo (`step: "credentials" | "two-factor"`), preserva el correo ingresado
 *   y almacena el mensaje de error si la autenticación falla.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado por `LoginForm` y `loginAction` para gestionar transiciones de estado de autenticación.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite una transición fluida en un único formulario entre el ingreso de contraseña y la solicitud del código TOTP.
 */
export interface LoginFormState {
  /** "credentials": paso de email y contraseña; "two-factor": paso de código TOTP de 6 dígitos. */
  step: "credentials" | "two-factor";
  email: string;
  error?: string;
}

/** Estado inicial limpio para el formulario de login. */
export const initialLoginState: LoginFormState = { step: "credentials", email: "" };
