/**
 * @file login.use-case.ts
 * @description Caso de uso para el inicio de sesión y persistencia del token de autenticación.
 */

import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { AuthRepository } from "../repositories/auth-repository";
import type { SessionStore } from "../repositories/session-store";

/**
 * Orquesta el flujo de inicio de sesión de un usuario.
 *
 * - **¿Qué hace?**:
 *   Normaliza el email a minúsculas y sin espacios, envía las credenciales a `authRepository.login`.
 *   Si el resultado es `"authenticated"`, guarda el token JWT en el `sessionStore` (cookie segura);
 *   si es `"two-factor-required"`, devuelve el requerimiento sin guardar aún el token.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Es invocado por la Server Action `loginAction` y por `RegisterUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que la sesión solo sea persistida cuando la autenticación se completa satisfactoriamente,
 *   soportando de manera nativa los flujos multifactor.
 */
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionStore: SessionStore,
  ) {}

  /**
   * Ejecuta el inicio de sesión con las credenciales dadas.
   *
   * - **¿Qué hace?**: Valida credenciales, almacena el token si procede y retorna el resultado discriminado.
   * - **¿Cómo interactúa con el sistema en general?**: Devuelve `LoginResult` hacia la Server Action.
   * - **¿Cuál es su importancia?**: Centraliza el control transaccional del ingreso al sistema.
   */
  async execute(credentials: Credentials): Promise<LoginResult> {
    const result = await this.authRepository.login({
      ...credentials,
      email: credentials.email.trim().toLowerCase(),
    });

    if (result.kind === "authenticated") {
      await this.sessionStore.save(result.token);
    }
    return result;
  }
}
