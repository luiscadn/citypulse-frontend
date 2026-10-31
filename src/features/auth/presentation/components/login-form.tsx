"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "../actions/auth.actions";
import { initialLoginState } from "../actions/login-form-state";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 " +
  "focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-300";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialLoginState);
  const from = useSearchParams().get("from") ?? "/";
  const askCode = state.step === "two-factor";
  // Campos controlados: React reinicia los no controlados después de cada acción,
  // y en el paso 2FA hay que reenviar el mismo correo y contraseña.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="step" value={state.step} />

      <label className="flex flex-col gap-1 text-sm font-medium">
        Correo
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={askCode}
          className={inputClass}
        />
      </label>

      {askCode ? (
        // En el paso 2FA la contraseña ya se escribió: viaja oculta con el formulario
        <input type="hidden" name="password" value={password} />
      ) : (
        <label className="flex flex-col gap-1 text-sm font-medium">
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
      )}

      {askCode && (
        <label className="flex flex-col gap-1 text-sm font-medium">
          Código de verificación (2FA)
          <input
            name="twoFactorCode"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            className={inputClass}
          />
        </label>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Entrando…" : askCode ? "Verificar código" : "Iniciar sesión"}
      </button>
    </form>
  );
}
