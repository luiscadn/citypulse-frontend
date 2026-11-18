/**
 * @file cancel-event-button.tsx
 * @description Client Component para la cancelación confirmada de un Evento.
 * Implementa confirmación interactiva en el propio flujo del componente sin diálogos bloqueantes de navegador.
 */

"use client";

import { useActionState, useState } from "react";
import { Alert, Button } from "@/shared/presentation/components";
import { cancelEventAction } from "../actions/event.actions";

/**
 * Botón interactivo para cancelar un evento tras solicitar confirmación.
 *
 * - **¿Qué hace?**:
 *   Muestra inicialmente un botón de "Cancelar evento". Al hacer clic, despliega un mensaje explicativo
 *   indicando que el evento seguirá visible pero con estado cancelado, junto con botones para confirmar o retractarse.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Enlaza la Server Action `cancelEventAction` mediante `useActionState`. Se utiliza en `EventDetail` para autores o administradores.
 *
 * - **¿Cuál es su importancia?**:
 *   Previene cancelaciones por error sin recurrir al anticuado y no accesible `window.confirm`.
 */
export function CancelEventButton({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [state, formAction, pending] = useActionState(cancelEventAction, {});
  const [confirming, setConfirming] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {confirming ? (
        <>
          <p className="text-sm text-ink">¿Cancelar &quot;{eventTitle}&quot;? Seguirá visible, marcado como cancelado.</p>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="danger" loading={pending}>
              {pending ? "Cancelando…" : "Sí, cancelar evento"}
            </Button>
            <Button type="button" variant="secondary" disabled={pending} onClick={() => setConfirming(false)}>
              No, volver
            </Button>
          </div>
        </>
      ) : (
        <div>
          <Button type="button" variant="danger" onClick={() => setConfirming(true)}>
            Cancelar evento
          </Button>
        </div>
      )}
    </form>
  );
}
