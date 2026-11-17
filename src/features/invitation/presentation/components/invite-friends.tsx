import Link from "next/link";
import { friendshipContainer } from "@/features/friendship/di/friendship.container";
import { Card, CardBody, CardHeader } from "@/shared/presentation/components";
import { InviteFriendForm } from "./invite-friend-form";

/** Tarjeta para invitar amigos a un evento. Sin amigos, explica cómo conseguirlos. */
export async function InviteFriends({ eventId }: { eventId: string }) {
  const { friends } = await friendshipContainer.getFriendshipOverviewUseCase.execute();

  return (
    <Card>
      <CardHeader title="Invitar amigos" description="Les llega a su bandeja de invitaciones." />
      <CardBody>
        {friends.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Aún no tienes amigos para invitar.{" "}
            <Link href="/friends" className="font-semibold text-primary-strong hover:underline">
              Busca personas
            </Link>
            .
          </p>
        ) : (
          <InviteFriendForm eventId={eventId} friends={friends} />
        )}
      </CardBody>
    </Card>
  );
}
