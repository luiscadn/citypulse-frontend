"use client";

import { use } from "react";
import type { FriendRelation, FriendshipOverview } from "../../domain/entities/friendship";
import { friendRelation } from "../../domain/rules/friend-relation";
import { FriendshipContext } from "../context/friendship-context";

export interface Friendship extends FriendshipOverview {
  relationWith: (userId: number) => FriendRelation;
}

/**
 * Hook useFriendship (Fachada de Lectura con React 19)
 *
 * - **¿Qué hace?**: Desempaqueta la promesa de `FriendshipContext` mediante `use()` y extiende el objeto resultante
 *   con un método auxiliar `relationWith(userId)` que calcula la relación social con cualquier usuario.
 * - **¿Cómo interactúa con el sistema en general?**: Se consume en `FriendshipOverview` y en `CandidateAction`.
 * - **¿Cuál es su importancia?**: Ofrece una API reactiva rica y lista para usar en los componentes cliente
 *   para consultar amigos, solicitudes y estados de conexión.
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
