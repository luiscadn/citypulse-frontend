"use client";

import { useActionState } from "react";
import { Alert, Button, TextField } from "@/shared/presentation/components";
import { updateProfileAction } from "../actions/profile.actions";
import type { ProfileFormState } from "../actions/profile-form-state";

export function ProfileForm({
  initial,
  email,
}: {
  initial: { fullName: string; username: string };
  /** El correo es la identidad de inicio de sesión: se muestra, no se edita */
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