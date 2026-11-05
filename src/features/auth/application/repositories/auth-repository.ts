import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { RegisterParams } from "../../domain/entities/register-params";

/** Puerto: cómo la aplicación habla con el backend de autenticación. */
export interface AuthRepository {
  login(credentials: Credentials): Promise<LoginResult>;
  /** Crea la cuenta. No inicia sesión: eso lo hace el caso de uso con login(). */
  register(params: RegisterParams): Promise<void>;
}