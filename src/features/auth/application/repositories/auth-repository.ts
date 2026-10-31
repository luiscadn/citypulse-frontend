import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";

/** Puerto: cómo la aplicación habla con el backend de autenticación. */
export interface AuthRepository {
  login(credentials: Credentials): Promise<LoginResult>;
}
