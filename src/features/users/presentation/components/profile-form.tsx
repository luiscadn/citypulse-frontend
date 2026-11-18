/**
 * @file profile-form.tsx
 * @description Client Component para el formulario de edición del perfil del usuario autenticado.
 */

"use client";

import { useActionState } from "react";
import { Alert, Button, TextField } from "@/shared/presentation/components";
import { updateProfileAction } from "../actions/profile.actions";
import type { ProfileFormState } from "../actions/profile-form-state";

/**
 * Formulario interactivo para visualizar y editar la información personal del usuario.
 *
 * - **¿Qué hace?**:
 *   Permite modificar el nombre completo (`fullName`) y nombre de usuario (`username`), mientras que exhibe
 *   el correo electrónico en modo solo lectura (`readOnly`), ya que el email representa la identidad inmutable
 *   de inicio de sesión de la cuenta. Despliega alertas de éxito o error al guardar.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Se conecta a la Server Action `updateProfileAction` mediante `useActionState`. Es el componente central
 *   de la página `/profile`.
 *
 * - **¿Cuál es su importancia?**:
 *   Ofrece al usuario la autonomía de gestionar su información pública manteniendo intacta su clave de acceso e identidad de login.
 */
export function ProfileForm({
  initial,
  email,
}: {
  initial: { fullName: string; username: string };
  /** Correo de la cuenta: funciona como identidad y no es modificable desde este formulario */
  email: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateProfileAction, {
    values: initial,
    errors: {},
  });

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <TextField
        label="Nombre completo"
        name="fullName"
        autoComplete="name"
        required
        defaultValue={state.values.fullName}
        error={state.errors.fullName}
      />
      <TextField
        label="Nombre de usuario"
        name="username"
        autoComplete="username"
        hint="Letras, números, punto, guion y guion bajo."
        required
        defaultValue={state.values.username}
        error={state.errors.username}
      />
      <TextField
        label="Correo electrónico"
        type="email"
        value={email}
        readOnly
        hint="Es tu identificador para iniciar sesión."
      />

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
