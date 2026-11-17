"use client";

import { useActionState } from "react";
import { updateProfileAction } from "../actions/profile.actions";
import type { ProfileFormState } from "../actions/profile-form-state";

/** Hook fachada del formulario de perfil. */
export function useProfileForm(initial: ProfileFormState["values"]) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateProfileAction, {
    values: initial,
    errors: {},
  });
  return { state, formAction, pending };
}
