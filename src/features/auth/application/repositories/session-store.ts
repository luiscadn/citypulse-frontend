/** Puerto: dónde se guarda el token de sesión (en la práctica, una cookie httpOnly). */
export interface SessionStore {
  save(token: string): Promise<void>;
  clear(): Promise<void>;
}
