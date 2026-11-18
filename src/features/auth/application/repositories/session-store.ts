/**
 * @file session-store.ts
 * @description Puerto secundario (interfaz) para el almacenamiento de la sesión del usuario.
 */

/**
 * Contrato que abstrae el almacenamiento local del token JWT de la sesión.
 *
 * - **¿Qué hace?**:
 *   Declara las operaciones para persistir el token de sesión (`save`) y para eliminarlo (`clear`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Implementado por `CookieSessionStore` en Infraestructura (usando cookies HTTP-only de Next.js)
 *   y consumido por `LoginUseCase` y `LogoutUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite sustituir el mecanismo de cookies seguras por simulaciones en memoria durante pruebas unitarias,
 *   garantizando independencia tecnológica.
 */
export interface SessionStore {
  /** Almacena el token de sesión de forma segura. */
  save(token: string): Promise<void>;

  /** Elimina el token de sesión cerrando la sesión del usuario. */
  clear(): Promise<void>;
}
