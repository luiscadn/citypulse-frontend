import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { HttpError } from "@/shared/infrastructure/http-client";
import type { TwoFactorRepository } from "../../application/repositories/two-factor-repository";
import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";
import {
  InvalidTwoFactorCodeError,
  TwoFactorAlreadyEnabledError,
} from "../../domain/errors/auth-errors";
import type { EnableTwoFactorRequestDto, TwoFactorSetupDto } from "../dtos/two-factor.dto";

export class HttpTwoFactorRepository implements TwoFactorRepository {
  async setup(): Promise<TwoFactorSetup> {
    try {
      const dto = await serverHttp.post<TwoFactorSetupDto>("/auth/2fa/generate", {});
      return { secret: dto.secret, qrCodeUrl: dto.qrCodeUrl };
    } catch (error) {
      // 400: el 2FA ya está activo (hay que desactivarlo antes de generar otro secreto)
      if (error instanceof HttpError && error.status === 400) throw new TwoFactorAlreadyEnabledError();
      throw error;
    }
  }

  async enable(code: string): Promise<void> {
    const body: EnableTwoFactorRequestDto = { code };
    try {
      await serverHttp.post("/auth/2fa/enable", body);
    } catch (error) {
      // 400: código incorrecto (o no se generó un secreto antes)
      if (error instanceof HttpError && error.status === 400) {
        throw new InvalidTwoFactorCodeError("El código no coincide. Revisa tu app e inténtalo de nuevo.");
      }
      throw error;
    }
  }

  async disable(): Promise<void> {
    await serverHttp.post("/auth/2fa/disable", {});
  }
}