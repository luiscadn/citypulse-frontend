"use client";

import { Badge } from "@/shared/presentation/components";
import { useFriendship } from "../hooks/use-friendship";
import { SendFriendRequestButton } from "./send-friend-request-button";

/** Lo que se puede hacer con una persona encontrada, según la relación que ya tengo con ella. */
export function CandidateAction({ userId }: { userId: number }) {
  const relation = useFriendship().relationWith(userId);

  if (relation === "friend") return <Badge tone="success">Ya son amigos</Badge>;
  if (relation === "request-sent") return <Badge tone="warning" dot>Solicitud enviada</Badge>;
  if (relation === "request-received") return <Badge tone="info">Te envió una solicitud</Badge>;
  return <SendFriendRequestButton targetUserId={userId} />;
}
