/**
 * @file register-form.tsx
 * @description Client Component para el formulario interactivo de registro de nuevos usuarios.
 */

"use client";

import { Alert, Button, TextField } from "@/shared/presentation/components";
import { PASSWORD_MIN } from "@/features/users/domain/rules/user-fields";
import { useRegister } from "../hooks/use-register";

/**
 * Formulario interactivo para la creación comunitaria de una nueva cuenta.
 *
 * - **¿Qué hace?**:
 *   Permite ingresar nombre completo, nombre de usuario, correo electrónico, contraseña y confirmación de contraseña.
 *   Preserva los valores textuales si la validación falla (mediante `defaultValue` desde el estado)
 *   y mapea los errores de validación a cada campo individual.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Conectado a `registerAction` mediante `useActionState`. Renderizado en `/register`.
 *
 * - **¿Cuál es su importancia?**:
 *   Facilita un registro accesible e intuitivo, impidiendo el envío de contraseñas discordantes antes de llegar al backend.
 */
export function RegisterForm() {
  const { state, formAction, pending } = useRegister();
  const { values, errors } = state;

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
