/**
 * @file login-form.tsx
 * @description Client Component para el formulario interactivo de Inicio de Sesión con soporte TOTP 2FA.
 */

"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, TextField } from "@/shared/presentation/components";
import { loginAction } from "../actions/auth.actions";
import { initialLoginState } from "../actions/login-form-state";

/**
 * Formulario interactivo de inicio de sesión que gestiona la transición entre credenciales y código 2FA.
 *
 * - **¿Qué hace?**:
 *   Maneja campos controlados de correo y contraseña. Si el estado devuelto por `loginAction` es `two-factor`,
 *   oculta el campo de contraseña visible (manteniéndolo oculto en un input hidden para el segundo envío)
 *   y despliega el campo enfocado para el código TOTP de 6 dígitos.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Conectado a la Server Action `loginAction` mediante `useActionState`. Renderizado en `/login`.
 *
 * - **¿Cuál es su importancia?**:
 *   Ofrece un flujo de autenticación seguro de dos pasos sin requerir recargas de página completas ni bifurcaciones de URL.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);
  const from = useSearchParams().get("from") ?? "/";
  const askCode = state.step === "two-factor";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="step" value={state.step} />

      {state.error && <Alert tone="danger">{state.error}</Alert>}

      {askCode && (
        <Alert tone="info" title="Verificación en dos pasos">
          Escribe el código de 6 dígitos de tu app autenticadora.
        </Alert>
      )}

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nombre@correo.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        readOnly={askCode}
      />

      {askCode ? (
        <input type="hidden" name="password" value={password} />
      ) : (
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {askCode && (
        <TextField
          label="Código de verificación"
          name="twoFactorCode"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          placeholder="123456"
          required
          autoFocus
          className="[&_input]:tracking-[0.4em]"
        />
      )}

      <Button type="submit" size="lg" loading={pending} className="mt-2 w-full">
        {pending ? "Entrando…" : askCode ? "Verificar código" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
