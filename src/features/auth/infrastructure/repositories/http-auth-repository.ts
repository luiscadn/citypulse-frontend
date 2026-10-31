import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { HttpError } from "@/shared/infrastructure/http-client";
import type { AuthRepository } from "../../application/repositories/auth-repository";
import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import { InvalidCredentialsError, InvalidTwoFactorCodeError } from "../../domain/errors/auth-errors";
import type { LoginResponseDto } from "../dtos/login.dto";
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
}
