/**
 * @file http-auth-repository.ts
 * @description Adaptador de Infraestructura que implementa el puerto `AuthRepository`.
 * Realiza las llamadas de red seguras en el servidor hacia `/auth/login` y `/auth/register`.
 */

import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { HttpError } from "@/shared/infrastructure/http-client";
import type { AuthRepository } from "../../application/repositories/auth-repository";
import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { RegisterParams } from "../../domain/entities/register-params";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  InvalidTwoFactorCodeError,
  UsernameAlreadyRegisteredError,
} from "../../domain/errors/auth-errors";
import type { LoginResponseDto } from "../dtos/login.dto";
import type { RegisterRequestDto } from "../dtos/register.dto";
import { toLoginRequestDto, toLoginResult } from "../mappers/auth.mapper";

/**
 * Implementación HTTP de `AuthRepository` para la comunicación con el microservicio de autenticación.
 *
 * - **¿Qué hace?**:
 *   Ejecuta `POST /auth/login` y `POST /auth/register` usando el cliente `serverHttp`,
 *   traduciendo respuestas 401 en `InvalidCredentialsError` o `InvalidTwoFactorCodeError`,
 *   y respuestas 409 en `EmailAlreadyRegisteredError` o `UsernameAlreadyRegisteredError`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Es instanciado en `auth.container.ts` e inyectado
 *   en `LoginUseCase` y `RegisterUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Desacopla la lógica de autenticación del transporte HTTP, traduciendo códigos de red en excepciones semánticas de dominio.
 */
export class HttpAuthRepository implements AuthRepository {
  /**
   * Envía credenciales al backend para autenticación.
   *
   * - **¿Qué hace?**: Envía la solicitud y transforma la respuesta en un `LoginResult`.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `LoginUseCase`.
   * - **¿Cuál es su importancia?**: Controla la respuesta diferenciada entre sesión directa y requerimiento de 2FA.
   */
  async login(credentials: Credentials): Promise<LoginResult> {
    try {
      const dto = await serverHttp.post<LoginResponseDto>(
        "/auth/login",
        toLoginRequestDto(credentials),
      );
      return toLoginResult(dto);
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        throw credentials.twoFactorCode
          ? new InvalidTwoFactorCodeError()
          : new InvalidCredentialsError();
      }
      throw error;
    }
  }

  /**
   * Envía los datos para crear una nueva cuenta.
   *
   * - **¿Qué hace?**: Ejecuta `POST /auth/register` y traduce conflictos 409 según el mensaje.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `RegisterUseCase`.
   * - **¿Cuál es su importancia?**: Proporciona el alta de usuarios gestionando de forma granular errores de email o username duplicado.
   */
  async register(params: RegisterParams): Promise<void> {
    const body: RegisterRequestDto = { ...params };
    try {
      await serverHttp.post("/auth/register", body);
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) {
        const message = String((error.body as { message?: string } | null)?.message ?? "").toLowerCase();
        if (message.includes("email")) throw new EmailAlreadyRegisteredError();
        if (message.includes("username")) throw new UsernameAlreadyRegisteredError();
      }
      throw error;
    }
  }
}
