import { Alert, Badge, Card, CardHeader, EmptyState } from "@/shared/presentation/components";
import { friendshipContainer } from "../../di/friendship.container";
import type { FriendshipOverview as Overview } from "../../domain/entities/friendship";
import { FriendRequestActions } from "./friend-request-actions";
import { FriendUserRow } from "./friend-user-row";

/**
 * Amigos y solicitudes pendientes del usuario de la sesión.
 * Lee la cookie de sesión: con Cache Components debe ir dentro de <Suspense>.
 */
export async function FriendshipOverview() {
  let overview: Overview;
  try {
    overview = await friendshipContainer.getFriendshipOverviewUseCase.execute();
  } catch {
    return <Alert tone="danger">No pudimos cargar tus amigos. Intenta de nuevo más tarde.</Alert>;
  }

  const { friends, pendingReceived, pendingSent } = overview;

  return (
    <div className="flex flex-col gap-6">
      {pendingReceived.length > 0 && (
        <Card>
          <CardHeader title="Solicitudes recibidas" description="Personas que quieren ser tus amigas." />
          <ul className="divide-y divide-line">
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
          <ul className="divide-y divide-line">
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
          <ul className="divide-y divide-line">
            {friends.map((friend) => (
              <FriendUserRow key={friend.id} user={friend} />
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="Todavía no tienes amigos"
          description="Cuando alguien acepte tu solicitud, aparecerá aquí."
        />
      )}
    </div>
  );
}
