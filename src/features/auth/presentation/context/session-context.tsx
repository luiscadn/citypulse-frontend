"use client";

import { createContext, type ReactNode } from "react";
import type { SessionUser } from "../../domain/entities/session-user";

/**
 * Estado de sesión compartido por toda la app protegida. Guarda la promesa y no el
 * usuario: el layout la crea sin esperarla, así el resto de la página no se bloquea
 * mientras se lee la cookie. Los componentes no lo leen directo: usan useSession().
 */
export const SessionContext = createContext<Promise<SessionUser | null> | null>(null);

export function SessionProvider({
  sessionPromise,
  children,
}: {
  sessionPromise: Promise<SessionUser | null>;
  children: ReactNode;
}) {
  return <SessionContext value={sessionPromise}>{children}</SessionContext>;
}
