"use client";

import { Badge } from "@/shared/presentation/components";
import { useFriendship } from "../hooks/use-friendship";
import { SendFriendRequestButton } from "./send-friend-request-button";

/**
 * Componente CandidateAction: Selector dinámico de acción o estado para usuarios encontrados en búsquedas.
 *
 * - **¿Qué hace?**: Consulta el estado de relación (`relationWith(userId)`) mediante el hook `useFriendship()`.
 *   - Si ya son amigos: muestra un `Badge` verde ("Ya son amigos").
 *   - Si ya se envió solicitud: muestra un `Badge` de advertencia ("Solicitud enviada").
 *   - Si la otra persona ya nos envió una solicitud: muestra un `Badge` informativo ("Te envió una solicitud").
 *   - Si no hay relación previa: renderiza el botón interactivo `SendFriendRequestButton`.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en cada fila de resultados en `FriendSearchResults`.
 * - **¿Cuál es su importancia?**: Evita envíos duplicados o contradictorios de solicitudes de amistad,
 *   presentando al usuario únicamente la acción o estado correspondiente a su situación social actual.
 */
export function CandidateAction({ userId }: { userId: number }) {
  const relation = useFriendship().relationWith(userId);

  if (relation === "friend") return <Badge tone="success">Ya son amigos</Badge>;
  if (relation === "request-sent") return <Badge tone="warning" dot>Solicitud enviada</Badge>;
  if (relation === "request-received") return <Badge tone="info">Te envió una solicitud</Badge>;
  return <SendFriendRequestButton targetUserId={userId} />;
}
