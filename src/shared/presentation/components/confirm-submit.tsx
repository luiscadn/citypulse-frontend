"use client";

import { useState } from "react";
import { Button } from "./button";

/**
 * Componente ConfirmSubmit: Botón de envío con confirmación inline en dos pasos.
 *
 * - **¿Qué hace?**: Muestra inicialmente un botón de advertencia/peligro. Al hacer clic, en lugar de invocar
 *   un diálogo bloqueante del navegador (`window.confirm`), despliega un panel inline con el mensaje explicativo
 *   y dos opciones: "Sí, eliminar" (que efectivamente ejecuta el submit del formulario) y "Cancelar" (que restaura el botón original).
 * - **¿Cómo interactúa con el sistema en general?**: Se integra en formularios de eliminación y acciones destructivas
 *   como `delete-zone-button.tsx` o la cancelación/eliminación de establecimientos y eventos.
 * - **¿Cuál es su importancia?**: Evita borrados accidentales de información sin degradar la experiencia de usuario con alertas nativas
 *   del navegador (las cuales son inaccesibles, no estilizables y bloquean el hilo principal).
 */
export function ConfirmSubmit({
  label,
  pendingLabel,
  message,
  pending,
}: {
  label: string;
  pendingLabel: string;
  message: string;
  pending: boolean;
}) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <div>
        <Button type="button" variant="danger" onClick={() => setAsking(true)}>
          {label}
        </Button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Confirmar: ${label}`}
      className="flex flex-col gap-3 rounded-md border border-danger bg-danger-soft p-3"
    >
      <p className="text-sm font-medium text-danger-strong">{message}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="danger" loading={pending}>
          {pending ? pendingLabel : "Sí, eliminar"}
        </Button>
        <Button type="button" variant="ghost" disabled={pending} onClick={() => setAsking(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
