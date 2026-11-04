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

export class HttpAuthRepository implements AuthRepository {
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

  async register(params: RegisterParams): Promise<void> {
    const body: RegisterRequestDto = { ...params };
    try {
      await serverHttp.post("/auth/register", body);
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) {
        // El backend responde "Email X already in use" o "Username X already in use"
        const message = String((error.body as { message?: string } | null)?.message ?? "").toLowerCase();
        if (message.includes("email")) throw new EmailAlreadyRegisteredError();
        if (message.includes("username")) throw new UsernameAlreadyRegisteredError();
      }
      throw error;
    }
  }
}