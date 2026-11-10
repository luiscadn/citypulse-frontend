import type { LoginResult } from "../../domain/entities/login-result";
import type { RegisterParams } from "../../domain/entities/register-params";
import { InvalidRegistrationError } from "../../domain/errors/auth-errors";
import { validateRegistration } from "../../domain/rules/registration";
import type { AuthRepository } from "../repositories/auth-repository";
import type { LoginUseCase } from "./login.use-case";

export interface RegisterResult {
  /** true si además de crear la cuenta se inició sesión */
  signedIn: boolean;
}

/** Crea la cuenta y, si se puede, inicia sesión de una vez. */
export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly loginUseCase: Pick<LoginUseCase, "execute">,
  ) {}

  async execute(params: RegisterParams): Promise<RegisterResult> {
    const clean: RegisterParams = {
      email: params.email.trim().toLowerCase(),
      username: params.username.trim(),
      fullName: params.fullName.trim(),
      password: params.password,
    };

    // Validación de dominio ANTES de la red; el backend valida de nuevo.
    const errors = validateRegistration(clean);
    if (Object.keys(errors).length > 0) throw new InvalidRegistrationError(errors);

    await this.authRepository.register(clean);

    // La cuenta ya existe: si el login automático falla, no se reintenta el
    // registro (daría "correo en uso"); el usuario solo entra desde /login.
    let result: LoginResult;
    try {
      result = await this.loginUseCase.execute({ email: clean.email, password: clean.password });
    } catch {
      return { signedIn: false };
    }
    return { signedIn: result.kind === "authenticated" };
  }
}