import {
  validateEmail,
  validateFullName,
  validatePassword,
  validateUsername,
} from "@/features/users/domain/rules/user-fields";
import type { RegisterParams } from "../entities/register-params";

export type RegistrationField = "email" | "username" | "fullName" | "password" | "confirmPassword";
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

/** Valida los datos de registro. Devuelve {} si todo está bien. */
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