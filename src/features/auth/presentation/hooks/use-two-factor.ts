"use client";

import { useState, useTransition } from "react";
import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";
import {
  disableTwoFactorAction,
  enableTwoFactorAction,
  startTwoFactorAction,
} from "../actions/two-factor.actions";

/**
 * Hook fachada para la configuración y gestión de la verificación en dos pasos (2FA / TOTP).
 *
 * - **¿Qué hace?**: Administra el estado completo del ciclo de vida de 2FA:
 *   - `setup`: Datos del código QR y secreto TOTP devueltos por el servidor.
 *   - `code`: Código de 6 dígitos introducido por el usuario.
 *   - `error` / `notice`: Mensajes de retroalimentación visual (alerta de error o éxito).
 *   - `confirmingDisable`: Estado del diálogo de confirmación para desactivar 2FA.
 *   - `start`, `confirmEnable`, `disable`, `cancelSetup`: Métodos asíncronos orquestados con `startTransition`.
 *
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente `TwoFactorSettings`
 *   en el perfil del usuario, ejecutando las Server Actions de `two-factor.actions.ts`.
 *
 * - **¿Cuál es su importancia?**: Encapsula la interacción asíncrona de seguridad TOTP manteniendo la UI
 *   totalmente reactiva y libre de bloqueos durante las transiciones de red.
 */
export function useTwoFactor() {
  const [pending, startTransition] = useTransition();
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmingDisable, setConfirmingDisable] = useState(false);

  /**
   * Inicia el proceso de enrolamiento de 2FA solicitando el secreto y código QR al servidor.
   */
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

  /**
   * Confirma la activación de 2FA enviando el código de 6 dígitos para su verificación criptográfica.
   */
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

  /**
   * Desactiva la verificación en dos pasos para la cuenta del usuario autenticado.
   */
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

  /**
   * Cancela el asistente de activación descartando el código QR en curso.
   */
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
