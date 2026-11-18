"use client";

import { createContext, type ReactNode } from "react";
import type { FriendshipOverview } from "../../domain/entities/friendship";

/**
 * Contexto FriendshipContext
 *
 * - **¿Qué hace?**: Almacena una promesa de lectura de `FriendshipOverview` (`Promise<FriendshipOverview> | null`).
 * - **¿Cómo interactúa con el sistema en general?**: Alimentado por `FriendshipProvider` y consumido por el hook `useFriendship`.
 * - **¿Cuál es su importancia?**: Permite que las diferentes secciones de la página `/friends` compartan el mismo resumen
 *   de amistades sin bloquear el renderizado del layout.
 */
export const FriendshipContext = createContext<Promise<FriendshipOverview> | null>(null);

/**
 * Componente Provider FriendshipProvider
 *
 * - **¿Qué hace?**: Provee la promesa `overviewPromise` a todo el subárbol de componentes de la vista de amigos.
 * - **¿Cómo interactúa con el sistema en general?**: Envuelto en `FriendsPage`.
 * - **¿Cuál es su importancia?**: Facilita el consumo asíncrono con React Suspense sin waterfalls de red.
 */
export function FriendshipProvider({
  overviewPromise,
  children,
}: {
  overviewPromise: Promise<FriendshipOverview>;
  children: ReactNode;
}) {
  return <FriendshipContext value={overviewPromise}>{children}</FriendshipContext>;
}
