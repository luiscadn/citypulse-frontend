"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { useSendFriendRequest } from "../hooks/use-friend-request-actions";

/**
 * Componente SendFriendRequestButton: Botón de acción para enviar solicitud de amistad.
 *
 * - **¿Qué hace?**: Renderiza un formulario que envía `targetUserId` mediante `useSendFriendRequest()`,
 *   mostrando un botón "Enviar solicitud" con estado de carga (`loading={pending}`) y alertas de error en caso de fallo.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza dentro de `CandidateAction` para usuarios
 *   con los que no existe relación previa (`relation === "none"`).
 * - **¿Cuál es su importancia?**: Punto de inicio de la conexión social entre dos usuarios en la plataforma.
 */
export function SendFriendRequestButton({ targetUserId }: { targetUserId: number }) {
  const { error, send, pending } = useSendFriendRequest();

  return (
    <form action={send} className="flex flex-col items-end gap-2">
      <input type="hidden" name="targetUserId" value={targetUserId} />
      <Button type="submit" size="sm" loading={pending}>
        Enviar solicitud
      </Button>
      {error && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
