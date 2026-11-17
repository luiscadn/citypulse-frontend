"use client";

import { useActionState } from "react";
import { registerAction } from "../actions/auth.actions";
import { initialRegisterState } from "../actions/register-form-state";

/** Hook fachada del formulario de registro. */
export function useRegister() {
  const [state, formAction, pending] = useActionState(registerAction, initialRegisterState);
  return { state, formAction, pending };
}
