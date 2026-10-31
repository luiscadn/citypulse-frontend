import type { SessionStore } from "../repositories/session-store";

/**
 * Cierra la sesión borrando el token. El backend usa JWT sin estado,
 * así que no hay que avisarle: basta con que el navegador ya no lo tenga.
 */
export class LogoutUseCase {
  constructor(private readonly sessionStore: SessionStore) {}

  execute(): Promise<void> {
    return this.sessionStore.clear();
  }
}
