"use client";

import { createContext, type ReactNode } from "react";
import type { PendingInvitation } from "../../domain/entities/invitation";

/**
 * Estado de invitaciones compartido por la bandeja: las pendientes se piden una sola vez.
 * Guarda la promesa para no bloquear la página. Los componentes no lo leen directo:
 * usan useInvitations().
 */
export const InvitationContext = createContext<Promise<readonly PendingInvitation[]> | null>(null);

export function InvitationProvider({
  pendingPromise,
  children,
}: {
  pendingPromise: Promise<readonly PendingInvitation[]>;
  children: ReactNode;
}) {
  return <InvitationContext value={pendingPromise}>{children}</InvitationContext>;
}
