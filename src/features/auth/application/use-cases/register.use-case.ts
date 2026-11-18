/**
 * @file register.use-case.ts
 * @description Caso de uso para el registro comunitario de usuarios con inicio de sesión automático.
 */

import type { LoginResult } from "../../domain/entities/login-result";
import type { RegisterParams } from "../../domain/entities/register-params";
import { InvalidRegistrationError } from "../../domain/errors/auth-errors";
import { validateRegistration } from "../../domain/rules/registration";
import type { AuthRepository } from "../repositories/auth-repository";
import type { LoginUseCase } from "./login.use-case";

/**
 * Resultado devuelto tras ejecutar el registro de usuario.
 */
export interface RegisterResult {
  /** Indica si, además de haberse creado la cuenta exitosamente, se logró iniciar sesión de forma automática. */
  signedIn: boolean;
}

/**
 * Orquesta la creación de una cuenta y el posterior inicio de sesión automático ("auto-login").
 *
 * - **¿Qué hace?**:
 *   Limpia y normaliza los parámetros de registro, ejecuta `validateRegistration` lanzando `InvalidRegistrationError`
 *   si hay campos inválidos, crea la cuenta en `authRepository.register`, e intenta de inmediato autenticar
 *   al usuario mediante `loginUseCase.execute`. Si el auto-login falla, no revierte el registro sino que
 *   retorna `signedIn: false` para que el usuario pueda iniciar sesión manualmente.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Aplicación. Se invoca desde la Server Action `registerAction` en `/register`.
 *
 * - **¿Cuál es su importancia?**:
 *   Mejora significativamente la experiencia del usuario (onboarding) al evitar tener que tipear
 *   nuevamente sus credenciales tras haberse registrado satisfactoriamente.
 */
export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly loginUseCase: Pick<LoginUseCase, "execute">,
  ) {}

  /**
   * Ejecuta el registro y el inicio de sesión encadenado.
   *
   * - **¿Qué hace?**: Normaliza datos, valida, registra e intenta autenticar.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna `RegisterResult` informando el estado del login automático.
   * - **¿Cuál es su importancia?**: Centraliza la lógica de bienvenida al nuevo usuario sin duplicar lógica de login.
   */
  async execute(params: RegisterParams): Promise<RegisterResult> {
    const clean: RegisterParams = {
      email: params.email.trim().toLowerCase(),
      username: params.username.trim(),
      fullName: params.fullName.trim(),
      password: params.password,
    };

    const errors = validateRegistration(clean);
    if (Object.keys(errors).length > 0) throw new InvalidRegistrationError(errors);

    await this.authRepository.register(clean);

    let result: LoginResult;
    try {
      result = await this.loginUseCase.execute({ email: clean.email, password: clean.password });
    } catch {
      return { signedIn: false };
    }
    return { signedIn: result.kind === "authenticated" };
  }
}
