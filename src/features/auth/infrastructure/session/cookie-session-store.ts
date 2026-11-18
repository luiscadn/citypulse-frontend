/**
 * @file cookie-session-store.ts
 * @description Adaptador de Infraestructura que implementa el puerto `SessionStore`
 * utilizando cookies HTTP-only en Next.js.
 */

import "server-only";

import {
  clearSessionToken,
  setSessionToken,
} from "@/shared/infrastructure/session/session-cookie";
import type { SessionStore } from "../../application/repositories/session-store";

/**
 * Implementación de `SessionStore` respaldada por cookies HTTP-only del servidor.
 *
 * - **¿Qué hace?**:
 *   Guarda (`save`) y elimina (`clear`) el token JWT de la sesión delegando en las utilidades de cookies compartidas.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Inyectado en `LoginUseCase` y `LogoutUseCase` a través de `auth.container.ts`.
 *
 * - **¿Cuál es su importancia?**:
 *   Protege el token JWT contra ataques de Cross-Site Scripting (XSS) al mantenerlo inaccesible para scripts en el navegador.
 */
export class CookieSessionStore implements SessionStore {
  save(token: string): Promise<void> {
    return setSessionToken(token);
  }

  clear(): Promise<void> {
    return clearSessionToken();
  }
}
