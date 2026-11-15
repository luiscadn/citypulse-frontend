"use client";

import { use } from "react";
import type { RoleName } from "@/shared/domain/enums";
import type { SessionUser } from "../../domain/entities/session-user";
import { hasRole } from "../../domain/rules/session-roles";
import { SessionContext } from "../context/session-context";

export interface Session {
  user: SessionUser | null;
  isAuthenticated: boolean;
  hasRole: (role: RoleName) => boolean;
}

/**
 * Hook fachada de la sesión: única forma de leer el usuario y sus roles desde un
 * componente de cliente. Suspende hasta tener la sesión, así que quien lo use debe
 * estar dentro de un <Suspense>.
 */
export function useSession(): Session {
  const sessionPromise = use(SessionContext);
  if (!sessionPromise) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  const user = use(sessionPromise);
  return {
    user,
    isAuthenticated: user !== null,
    hasRole: (role) => hasRole(user, role),
  };
}
