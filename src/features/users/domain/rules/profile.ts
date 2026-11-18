/**
 * @file profile.ts
 * @description Reglas de Dominio y agregador de validaciones para el formulario de Perfil de Usuario.
 */

import { validateFullName, validateUsername } from "./user-fields";

/** Campos editables del perfil de usuario. */
export type ProfileField = "fullName" | "username";

/** Mapa de errores por campo del perfil. */
export type ProfileErrors = Partial<Record<ProfileField, string>>;

/**
 * Valida los datos mutables del perfil del usuario (nombre completo y nombre de usuario).
 *
 * - **¿Qué hace?**:
 *   Ejecuta `validateFullName` y `validateUsername` sobre los valores recibidos y construye un objeto con los errores detectados;
 *   retorna un objeto vacío `{}` si todos los campos son válidos.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocado al inicio de `updateProfileAction` antes de contactar al backend.
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza la validación del perfil del usuario, evitando lógica duplicada y desacoplando la UI de la verificación.
 */
export function validateProfile(values: { fullName: string; username: string }): ProfileErrors {
  const errors: ProfileErrors = {};
  const fullName = validateFullName(values.fullName);
  const username = validateUsername(values.username);
  if (fullName) errors.fullName = fullName;
  if (username) errors.username = username;
  return errors;
}
