"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { useRespondFriendRequest } from "../hooks/use-friend-request-actions";

/**
 * Componente FriendRequestActions: Controles interactivos para aceptar o declinar solicitudes de amistad.
 *
 * - **¿Qué hace?**: Renderiza un formulario con dos botones: "Aceptar" (`value="ACEPTADA"`) y "Rechazar" (`value="RECHAZADA"`).
 *   Muestra cualquier error producido por la Server Action y deshabilita los botones durante el procesamiento (`pending`).
 * - **¿Cómo interactúa con el sistema en general?**: Se compone dentro de cada fila de `FriendshipOverview`
 *   en la sección de solicitudes recibidas. Invoca `respondFriendRequestAction`.
 * - **¿Cuál es su importancia?**: Permite gestionar solicitudes de amistad de forma reactiva e instantánea.
 */
export function FriendRequestActions({ requestId }: { requestId: number }) {
  const { error, respond, pending } = useRespondFriendRequest();

  return (
    <form action={respond} className="flex flex-col items-end gap-2">
      <input type="hidden" name="requestId" value={requestId} />
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
