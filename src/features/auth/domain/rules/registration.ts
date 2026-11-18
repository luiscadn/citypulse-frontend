/**
 * @file registration.ts
 * @description Reglas de Dominio y validador de registro de nuevos usuarios.
 */

import {
  validateEmail,
  validateFullName,
  validatePassword,
  validateUsername,
} from "@/features/users/domain/rules/user-fields";
import type { RegisterParams } from "../entities/register-params";

/** Campos sujetos a validación en el formulario de registro. */
export type RegistrationField = "email" | "username" | "fullName" | "password" | "confirmPassword";

/** Diccionario de errores de validación por campo de registro. */
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

/**
 * Valida todos los campos de registro comunitario según las reglas de formato de usuario.
 *
 * - **¿Qué hace?**:
 *   Evalúa `fullName`, `username`, `email` y `password` usando las funciones de dominio de `user-fields`.
 *   Retorna un objeto con los errores encontrados o `{}` si los datos son válidos.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocado por `RegisterUseCase` y por la Server Action `registerAction`.
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el principio de validación temprana en el cliente/servidor Next.js antes de emitir peticiones a la API NestJS.
 */
export function validateRegistration(params: RegisterParams): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const checks: Array<[RegistrationField, string | undefined]> = [
    ["fullName", validateFullName(params.fullName)],
    ["username", validateUsername(params.username)],
    ["email", validateEmail(params.email)],
    ["password", validatePassword(params.password)],
  ];
  for (const [field, message] of checks) {
    if (message) errors[field] = message;
  }
  return errors;
}
