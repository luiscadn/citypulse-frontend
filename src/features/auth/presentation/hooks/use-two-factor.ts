"use client";

import { useState, useTransition } from "react";
import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";
import {
  disableTwoFactorAction,
  enableTwoFactorAction,
  startTwoFactorAction,
} from "../actions/two-factor.actions";

/**
 * Hook fachada de la verificación en dos pasos: guarda el QR en curso, el código
 * escrito y los mensajes, y llama a las acciones del servidor.
 */
export function useTwoFactor() {
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

  function cancelSetup() {
    setSetup(null);
    setError(null);
  }

  return {
    pending,
    setup,
    code,
    setCode,
    error,
    notice,
    confirmingDisable,
    setConfirmingDisable,
    start,
    confirmEnable,
    disable,
    cancelSetup,
  };
}
