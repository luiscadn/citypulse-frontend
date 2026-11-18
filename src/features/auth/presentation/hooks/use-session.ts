/**
 * @file use-session.ts
 * @description Hook fachada de React 19 para la lectura de la Sesión de Usuario en Client Components.
 */

"use client";

import { use } from "react";
import type { RoleName } from "@/shared/domain/enums";
import type { SessionUser } from "../../domain/entities/session-user";
import { hasRole } from "../../domain/rules/session-roles";
import { SessionContext } from "../context/session-context";

/** Interfaz devuelta por el hook `useSession`. */
export interface Session {
  user: SessionUser | null;
  isAuthenticated: boolean;
  hasRole: (role: RoleName) => boolean;
}

/**
 * Hook de cliente para acceder al usuario autenticado y verificar sus roles.
 *
 * - **¿Qué hace?**:
 *   Consume `SessionContext` utilizando la API `use()` de React 19 y desenvuelve la promesa de sesión.
 *   Suspende el renderizado hasta que la sesión esté resuelta y expone helpers de autenticación y verificación de roles (`hasRole`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en componentes de navegación como `SessionMenu` y en componentes interactivos que requieran conocer la sesión.
 *
 * - **¿Cuál es su importancia?**:
 *   Aprovecha las capacidades nativas de Suspense de React 19 para un manejo reactivo, declarativo y elegante del estado de autenticación.
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
