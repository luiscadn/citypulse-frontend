"use client";

import { useActionState } from "react";
import { Alert, Button, TextField } from "@/shared/presentation/components";
import { PASSWORD_MIN } from "@/features/users/domain/rules/user-fields";
import { registerAction } from "../actions/auth.actions";
import { initialRegisterState } from "../actions/register-form-state";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialRegisterState);
  const { values, errors } = state;

  // React reinicia el formulario tras cada acción: los valores vuelven a escribirse
  // desde el estado (defaultValue). Las contraseñas no se conservan, a propósito.
  return (
    <form action={formAction} className="flex w-full flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}

      <TextField
        label="Nombre completo"
        name="fullName"
        autoComplete="name"
        placeholder="Ana Pérez"
        required
        defaultValue={values.fullName}
        error={errors.fullName}
      />
      <TextField
        label="Nombre de usuario"
        name="username"
        autoComplete="username"
        placeholder="ana_perez"
        hint="Letras, números, punto, guion y guion bajo."
        required
        defaultValue={values.username}
        error={errors.username}
      />
      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nombre@correo.com"
        required
        defaultValue={values.email}
        error={errors.email}
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo ${PASSWORD_MIN} caracteres.`}
        required
        error={errors.password}
      />
      <TextField
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword}
      />

      <Button type="submit" size="lg" loading={pending} className="mt-2 w-full">
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}