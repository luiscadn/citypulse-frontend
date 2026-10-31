import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { AuthRepository } from "../repositories/auth-repository";
import type { SessionStore } from "../repositories/session-store";

/** Inicia sesión y, si el backend entrega el token, lo guarda en la sesión. */
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionStore: SessionStore,
  ) {}

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
