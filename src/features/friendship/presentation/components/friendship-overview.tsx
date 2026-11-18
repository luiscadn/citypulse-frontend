"use client";

import { Badge, Card, CardHeader, EmptyState } from "@/shared/presentation/components";
import { useFriendship } from "../hooks/use-friendship";
import { FriendRequestActions } from "./friend-request-actions";
import { FriendUserRow } from "./friend-user-row";

/**
 * Componente Client Component FriendshipOverview: Tablero general de amistades.
 *
 * - **¿Qué hace?**: Consume `useFriendship()` para renderizar:
 *   1. Tarjeta de solicitudes recibidas con `FriendRequestActions` (si hay pendientes).
 *   2. Tarjeta de solicitudes enviadas con insignia "Pendiente" (si hay pendientes).
 *   3. Tarjeta con la lista de amigos actuales o `EmptyState` si aún no cuenta con amigos.
 * - **¿Cómo interactúa con el sistema en general?**: Se monta en `src/app/(app)/friends/page.tsx` dentro de un límite de `<Suspense>`.
 * - **¿Cuál es su importancia?**: Ofrece una visión panorámica y control completo del círculo social del usuario en CityPulse.
 */
export function FriendshipOverview() {
  const { friends, pendingReceived, pendingSent } = useFriendship();

  return (
    <div className="flex flex-col gap-6">
      {pendingReceived.length > 0 && (
        <Card>
          <CardHeader title="Solicitudes recibidas" description="Personas que quieren ser tus amigas." />
          <ul className="stagger divide-y divide-line">
            {pendingReceived.map((request) => (
              <FriendUserRow key={request.id} user={request.from}>
                <FriendRequestActions requestId={request.id} />
              </FriendUserRow>
            ))}
          </ul>
        </Card>
      )}

      {pendingSent.length > 0 && (
        <Card>
          <CardHeader title="Solicitudes enviadas" description="Todavía no las han respondido." />
          <ul className="stagger divide-y divide-line">
            {pendingSent.map((request) => (
              <FriendUserRow key={request.id} user={request.to}>
                <Badge tone="warning" dot>
                  Pendiente
                </Badge>
              </FriendUserRow>
            ))}
          </ul>
        </Card>
      )}

      {friends.length > 0 ? (
        <Card>
          <CardHeader title="Mis amigos" />
          <ul className="stagger divide-y divide-line">
            {friends.map((friend) => (
              <FriendUserRow key={friend.id} user={friend} />
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="Todavía no tienes amigos"
          description="Busca a alguien arriba y envíale una solicitud. Cuando la acepte, aparecerá aquí."
        />
      )}
    </div>
  );
}
