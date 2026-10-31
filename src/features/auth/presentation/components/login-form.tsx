"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, TextField } from "@/shared/presentation/components";
import { loginAction } from "../actions/auth.actions";
import { initialLoginState } from "../actions/login-form-state";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);
  const from = useSearchParams().get("from") ?? "/";
  const askCode = state.step === "two-factor";
  // Campos controlados: React reinicia los no controlados después de cada acción,
  // y en el paso 2FA hay que reenviar el mismo correo y contraseña.
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
        // En el paso 2FA la contraseña ya se escribió: viaja oculta con el formulario
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
