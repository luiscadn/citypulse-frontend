/**
 * @file profile-form-state.ts
 * @description Tipos y estados auxiliares para el formulario de actualización de Perfil de Usuario.
 * Diseñados para integrarse con `useActionState` de React 19.
 */

import type { ProfileErrors } from "../../domain/rules/profile";

/**
 * Estado del formulario de perfil retornado por `updateProfileAction`.
 *
 * - **¿Qué hace?**:
 *   Mantiene los valores actuales (`fullName` y `username`), el diccionario de errores por campo (`errors`),
 *   el mensaje de error general (`error`) y el mensaje de confirmación exitosa (`success`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Retornado por la Server Action `updateProfileAction` y consumido por el hook `useActionState` en `ProfileForm`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite una actualización progresiva y accesible de la pantalla de perfil sin pérdida de datos ante fallos.
 */
export interface ProfileFormState {
  /** Valores actuales del formulario. */
  values: { fullName: string; username: string };
  /** Errores asociados específicamente a cada campo. */
  errors: ProfileErrors;
  /** Mensaje de error general no atribuible a un campo individual. */
  error?: string;
  /** Mensaje de éxito tras guardar los cambios. */
  success?: string;
}
