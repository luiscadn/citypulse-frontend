"use client";

import { createContext, type ReactNode } from "react";
import type { FriendshipOverview } from "../../domain/entities/friendship";

/**
 * Estado de amistades compartido por la página de amigos: el resumen se pide una sola
 * vez y lo leen el listado y la búsqueda. Guarda la promesa para no bloquear la página.
 * Los componentes no lo leen directo: usan useFriendship().
 */
export const FriendshipContext = createContext<Promise<FriendshipOverview> | null>(null);

export function FriendshipProvider({
  overviewPromise,
  children,
}: {
  overviewPromise: Promise<FriendshipOverview>;
  children: ReactNode;
}) {
  return <FriendshipContext value={overviewPromise}>{children}</FriendshipContext>;
}
