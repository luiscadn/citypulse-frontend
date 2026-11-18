"use client";

import { useActionState } from "react";
import { updateProfileAction } from "../actions/profile.actions";
import type { ProfileFormState } from "../actions/profile-form-state";

/**
 * Hook fachada para el formulario de actualización del perfil de usuario.
 *
 * - **¿Qué hace?**: Vincula la Server Action `updateProfileAction` con `useActionState`, inicializando los campos
 *   con los datos actuales del usuario (`initial`) y exponiendo `state`, `formAction` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `ProfileForm` en la vista de configuración de cuenta `/profile`.
 * - **¿Cuál es su importancia?**: Separa el estado y la mutación del perfil de usuario de la capa de renderizado visual.
 */
export function useProfileForm(initial: ProfileFormState["values"]) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateProfileAction, {
    values: initial,
    errors: {},
  });
  return { state, formAction, pending };
}
