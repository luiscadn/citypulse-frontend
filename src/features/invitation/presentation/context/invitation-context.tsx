"use client";

import { createContext, type ReactNode } from "react";
import type { PendingInvitation } from "../../domain/entities/invitation";

/**
 * Contexto InvitationContext
 *
 * - **¿Qué hace?**: Almacena una promesa de lectura de invitaciones pendientes (`Promise<readonly PendingInvitation[]> | null`).
 * - **¿Cómo interactúa con el sistema en general?**: Es alimentado por `InvitationProvider` y consumido por el hook `useInvitations`.
 * - **¿Cuál es su importancia?**: Permite compartir la promesa de invitaciones sin esperar a que resuelva en el servidor (sin `await`),
 *   habilitando que los componentes hijos se suspendan independientemente mediante React Suspense.
 */
export const InvitationContext = createContext<Promise<readonly PendingInvitation[]> | null>(null);

/**
 * Componente Provider InvitationProvider
 *
 * - **¿Qué hace?**: Provee la promesa `pendingPromise` a todos los componentes descendientes.
 * - **¿Cómo interactúa con el sistema en general?**: Se envuelve en `InvitationsPage`.
 * - **¿Cuál es su importancia?**: Desacopla la obtención de la promesa de datos en la página de su resolución en el cliente.
 */
export function InvitationProvider({
  pendingPromise,
  children,
}: {
  pendingPromise: Promise<readonly PendingInvitation[]>;
  children: ReactNode;
}) {
  return <InvitationContext value={pendingPromise}>{children}</InvitationContext>;
}
