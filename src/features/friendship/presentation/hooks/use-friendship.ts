"use client";

import { use } from "react";
import type { FriendRelation, FriendshipOverview } from "../../domain/entities/friendship";
import { friendRelation } from "../../domain/rules/friend-relation";
import { FriendshipContext } from "../context/friendship-context";

export interface Friendship extends FriendshipOverview {
  relationWith: (userId: number) => FriendRelation;
}

/**
 * Hook fachada de amistades: mis amigos, mis solicitudes pendientes y qué relación
 * tengo con otra persona. Suspende hasta tener el resumen: va dentro de un <Suspense>.
 */
export function useFriendship(): Friendship {
  const overviewPromise = use(FriendshipContext);
  if (!overviewPromise) {
    throw new Error("useFriendship debe usarse dentro de un FriendshipProvider");
  }
  const overview = use(overviewPromise);
  return {
    ...overview,
    relationWith: (userId) => friendRelation(userId, overview),
  };
}
