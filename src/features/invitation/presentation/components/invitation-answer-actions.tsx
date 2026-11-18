"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { useRespondInvitation } from "../hooks/use-respond-invitation";

/**
 * Componente InvitationAnswerActions: Controles de aceptación y rechazo de invitación.
 *
 * - **¿Qué hace?**: Renderiza un formulario con dos botones: "Aceptar" (`value="ACEPTADA"`) y "Rechazar" (`value="RECHAZADA"`).
 *   Ambos botones se deshabilitan mientras la acción está en curso (`pending`) y muestran cualquier mensaje de error devuelto por la Server Action.
 * - **¿Cómo interactúa con el sistema en general?**: Se compone dentro de cada fila de `InvitationInbox`.
 *   Al ser enviado, ejecuta `respondInvitationAction` a través del hook `useRespondInvitation`.
 * - **¿Cuál es su importancia?**: Ofrece una interfaz compacta y reactiva para responder invitaciones sin recargas de página.
 */
export function InvitationAnswerActions({ invitationId }: { invitationId: number }) {
  const { error, respond, pending } = useRespondInvitation();

  return (
    <form action={respond} className="flex flex-col items-end gap-2">
      <input type="hidden" name="invitationId" value={invitationId} />
      <div className="flex gap-2">
        <Button type="submit" name="answer" value="ACEPTADA" size="sm" disabled={pending}>
          Aceptar
        </Button>
        <Button type="submit" name="answer" value="RECHAZADA" size="sm" variant="secondary" disabled={pending}>
          Rechazar
        </Button>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
