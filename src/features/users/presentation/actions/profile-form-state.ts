import type { ProfileErrors } from "../../domain/rules/profile";

/** Estado del formulario de perfil que devuelve updateProfileAction (useActionState). */
export interface ProfileFormState {
  /** Valores ya guardados (o los que escribió el usuario si hubo errores) */
  values: { fullName: string; username: string };
  errors: ProfileErrors;
  /** Error general (no ligado a un campo) */
  error?: string;
  /** Mensaje de éxito */
  success?: string;
}