"use client";

import { useState } from "react";
import { Button } from "./button";

/**
 * Botón de envío que pide confirmación en la misma página, sin window.confirm.
 * El primer clic muestra el aviso; solo "Sí, eliminar" envía el formulario que lo contiene.
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
