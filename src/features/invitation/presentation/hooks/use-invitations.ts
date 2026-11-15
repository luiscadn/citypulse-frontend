"use client";

import { use } from "react";
import type { PendingInvitation } from "../../domain/entities/invitation";
import { InvitationContext } from "../context/invitation-context";

export interface Invitations {
  pending: readonly PendingInvitation[];
}

/**
 * Hook fachada de invitaciones: las que recibí y siguen sin respuesta.
 * Suspende hasta tenerlas: va dentro de un <Suspense>.
 */
export function useInvitations(): Invitations {
  const pendingPromise = use(InvitationContext);
  if (!pendingPromise) {
    throw new Error("useInvitations debe usarse dentro de un InvitationProvider");
  }
  return { pending: use(pendingPromise) };
}
