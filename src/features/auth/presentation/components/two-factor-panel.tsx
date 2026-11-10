"use client";

import { useState, useTransition } from "react";
import { Alert, Badge, Button, TextField } from "@/shared/presentation/components";
import {
  disableTwoFactorAction,
  enableTwoFactorAction,
  startTwoFactorAction,
} from "../actions/two-factor.actions";
import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";

/**
 * Verificación en dos pasos (TOTP): activar con QR + código, o desactivar.
 * `enabled` viene del servidor; tras cada acción la página se refresca sola.
 */
export function TwoFactorPanel({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmingDisable, setConfirmingDisable] = useState(false);

  function start() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await startTwoFactorAction();
      if (result.ok) {
        setSetup(result.data);
        setCode("");
      } else {
        setError(result.error);
      }
    });
  }

  function confirmEnable() {
    setError(null);
    startTransition(async () => {
      const result = await enableTwoFactorAction(code);
      if (result.ok) {
        setSetup(null);
        setCode("");
        setNotice("Verificación en dos pasos activada. Te pediremos un código al iniciar sesión.");
      } else {
        setError(result.error);
      }
    });
  }

  function disable() {
    setError(null);
    startTransition(async () => {
      const result = await disableTwoFactorAction();
      if (result.ok) {
        setConfirmingDisable(false);
        setNotice("Verificación en dos pasos desactivada.");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={enabled ? "success" : "neutral"} dot>
          {enabled ? "Activada" : "Desactivada"}
        </Badge>
        <p className="text-sm text-ink-muted">
          Añade una capa de seguridad: además de la contraseña, se pide un código de tu app
          autenticadora (Google Authenticator, Authy…).
        </p>
      </div>

      {error && <Alert tone="danger">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      {/* Activar: paso 1 */}
      {!enabled && !setup && (
        <div>
          <Button onClick={start} loading={pending}>
            Activar verificación en dos pasos
          </Button>
        </div>
      )}

      {/* Activar: paso 2 (QR + código) */}
      {!enabled && setup && (
        <div className="flex flex-col gap-5 rounded-lg border border-line bg-canvas p-4 sm:p-5">
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm text-ink">
            <li>Escanea este código QR con tu app autenticadora.</li>
            <li>Escribe aquí el código de 6 dígitos que te muestra.</li>
          </ol>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* Data URL generada por el backend: next/image no aporta nada aquí */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={setup.qrCodeUrl}
              alt="Código QR para configurar la verificación en dos pasos"
              width={176}
              height={176}
              className="size-44 rounded-md border border-line bg-white p-2"
            />
            <div className="flex min-w-0 flex-col gap-1 text-sm">
              <p className="text-ink-muted">¿No puedes escanear? Escribe esta clave a mano:</p>
              <code className="rounded-md bg-neutral-soft px-2 py-1 font-mono text-xs break-all text-ink">
                {setup.secret}
              </code>
            </div>
          </div>

          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              confirmEnable();
            }}
          >
            <TextField
              label="Código de verificación"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              placeholder="123456"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="sm:flex-1 [&_input]:tracking-[0.4em]"
            />
            <div className="flex gap-2">
              <Button type="submit" loading={pending} disabled={code.length !== 6}>
                Confirmar y activar
              </Button>
              <Button
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  setSetup(null);
                  setError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Desactivar */}
      {enabled && !confirmingDisable && (
        <div>
          <Button variant="secondary" onClick={() => setConfirmingDisable(true)}>
            Desactivar
          </Button>
        </div>
      )}
      {enabled && confirmingDisable && (
        <Alert tone="warning" title="¿Desactivar la verificación en dos pasos?">
          <p>Tu cuenta quedará protegida solo por la contraseña.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="danger" size="sm" loading={pending} onClick={disable}>
              Sí, desactivar
            </Button>
            <Button variant="ghost" size="sm" disabled={pending} onClick={() => setConfirmingDisable(false)}>
              Cancelar
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
}