/**
 * @file session-context.tsx
 * @description Contexto de React para la distribución fluida y sin bloqueo de la Sesión de Usuario.
 * Aplica el patrón de promesa de sesión en streaming con React 19.
 */

"use client";

import { createContext, type ReactNode } from "react";
import type { SessionUser } from "../../domain/entities/session-user";

/**
 * Contexto de React que almacena la promesa de la sesión del usuario (`Promise<SessionUser | null>`).
 *
 * - **¿Qué hace?**:
 *   En lugar de almacenar el usuario ya resuelto, almacena la promesa de resolución de la sesión generada en el Server Layout.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Consumido exclusivamente por el hook `useSession()`.
 *
 * - **¿Cuál es su importancia?**:
 *   Evita bloquear el renderizado del layout principal mientras se lee la cookie de sesión en el servidor,
 *   permitiendo que el contenido estático comience a fluir hacia el cliente inmediatamente (Streaming RSC).
 */
export const SessionContext = createContext<Promise<SessionUser | null> | null>(null);

/**
 * Proveedor de contexto de sesión que envuelve a toda la aplicación protegida.
 */
export function SessionProvider({
  sessionPromise,
  children,
}: {
  sessionPromise: Promise<SessionUser | null>;
  children: ReactNode;
}) {
  return <SessionContext value={sessionPromise}>{children}</SessionContext>;
}
