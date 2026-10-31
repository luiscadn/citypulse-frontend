/** Estado del formulario de login que devuelve loginAction (useActionState). */
export interface LoginFormState {
  /** "credentials": email + contraseña · "two-factor": se pide el código TOTP */
  step: "credentials" | "two-factor";
  email: string;
  error?: string;
}

export const initialLoginState: LoginFormState = { step: "credentials", email: "" };
