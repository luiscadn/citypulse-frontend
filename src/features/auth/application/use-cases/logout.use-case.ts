/**
 * @file logout.use-case.ts
 * @description Caso de uso para el cierre de sesión del usuario autenticado.
 */

import type { SessionStore } from "../repositories/session-store";

/**
 * Orquesta el cierre de sesión mediante la eliminación de la cookie de autenticación.
 *
 * - **¿Qué hace?**:
 *   Invoca `sessionStore.clear()` para eliminar el token JWT de la cookie HTTP-only del navegador.
 *   Dado que la autenticación del backend es completamente sin estado (stateless JWT), no se requiere
 *   una llamada de red adicional para invalidar la sesión.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es invocado por la Server Action `logoutAction`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura un cierre de sesión inmediato y limpio del lado del cliente, previniendo accesos residuales.
 */
export class LogoutUseCase {
  constructor(private readonly sessionStore: SessionStore) {}

  /**
   * Ejecuta el cierre de sesión limpiando el almacenamiento de tokens.
   */
  execute(): Promise<void> {
    return this.sessionStore.clear();
  }
}
