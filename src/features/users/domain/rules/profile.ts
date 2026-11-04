import { validateFullName, validateUsername } from "./user-fields";

export type ProfileField = "fullName" | "username";
export type ProfileErrors = Partial<Record<ProfileField, string>>;

/** Valida los datos editables del perfil. Devuelve {} si todo está bien. */
export function validateProfile(values: { fullName: string; username: string }): ProfileErrors {
  const errors: ProfileErrors = {};
  const fullName = validateFullName(values.fullName);
  const username = validateUsername(values.username);
  if (fullName) errors.fullName = fullName;
  if (username) errors.username = username;
  return errors;
}
