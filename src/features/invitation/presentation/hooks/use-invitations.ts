"use client";

import { use } from "react";
import type { PendingInvitation } from "../../domain/entities/invitation";
import { InvitationContext } from "../context/invitation-context";

export interface Invitations {
  pending: readonly PendingInvitation[];
}

/**
 * Hook useInvitations (Fachada de Lectura con React 19)
 *
 * - **¿Qué hace?**: Consume la promesa almacenada en `InvitationContext` utilizando la API `use()` de React 19,
 *   suspendiendo el componente cliente hasta que las invitaciones pendientes sean devueltas por el servidor.
 * - **¿Cómo interactúa con el sistema en general?**: Es invocado por `InvitationInbox` dentro de un límite `<Suspense>`.
 * - **¿Cuál es su importancia?**: Simplifica el acceso a datos asíncronos en componentes cliente, eliminando
 *   la necesidad de `useEffect`, estados locales booleanos de carga o librerías de fetching complejas.
 */
export function useInvitations(): Invitations {
  const pendingPromise = use(InvitationContext);
  if (!pendingPromise) {
    throw new Error("useInvitations debe usarse dentro de un InvitationProvider");
  }
  return { pending: use(pendingPromise) };
}
