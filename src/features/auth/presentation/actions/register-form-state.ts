import type { RegistrationErrors } from "../../domain/rules/registration";

/** Estado del formulario de registro que devuelve registerAction (useActionState). */
export interface RegisterFormState {
  /** Lo que escribió el usuario (menos las contraseñas), para no perderlo al fallar */
  values: { fullName: string; username: string; email: string };
  /** Errores por campo */
  errors: RegistrationErrors;
  /** Error general (no ligado a un campo) */
  error?: string;
}

export const initialRegisterState: RegisterFormState = {
  values: { fullName: "", username: "", email: "" },
  errors: {},
};