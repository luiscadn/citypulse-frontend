/**
 * @file http-two-factor-repository.ts
 * @description Adaptador de Infraestructura que implementa el puerto `TwoFactorRepository`.
 * Realiza las llamadas hacia `/auth/2fa/generate`, `/auth/2fa/enable` y `/auth/2fa/disable`.
 */

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

/**
 * Implementación HTTP de `TwoFactorRepository` para la gestión de 2FA.
 *
 * - **¿Qué hace?**:
 *   Maneja las peticiones para generar secretos (`/auth/2fa/generate`), validar códigos de activación
 *   (`/auth/2fa/enable`) y deshabilitar el servicio (`/auth/2fa/disable`), traduciendo errores HTTP 400.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Instanciado en `auth.container.ts` e inyectado en los casos de uso de 2FA.
 *
 * - **¿Cuál es su importancia?**:
 *   Encapsula las llamadas REST seguras de doble factor facilitando su consumo en la aplicación.
 */
export class HttpTwoFactorRepository implements TwoFactorRepository {
  /**
   * Genera el secreto y el QR de enrolamiento.
   */
  async setup(): Promise<TwoFactorSetup> {
    try {
      const dto = await serverHttp.post<TwoFactorSetupDto>("/auth/2fa/generate", {});
      return { secret: dto.secret, qrCodeUrl: dto.qrCodeUrl };
    } catch (error) {
      if (error instanceof HttpError && error.status === 400) throw new TwoFactorAlreadyEnabledError();
      throw error;
    }
  }

  /**
   * Valida el código TOTP para activar definitivamente el 2FA.
   */
  async enable(code: string): Promise<void> {
    const body: EnableTwoFactorRequestDto = { code };
    try {
      await serverHttp.post("/auth/2fa/enable", body);
    } catch (error) {
      if (error instanceof HttpError && error.status === 400) {
        throw new InvalidTwoFactorCodeError("El código no coincide. Revisa tu app e inténtalo de nuevo.");
      }
      throw error;
    }
  }

  /**
   * Desactiva el 2FA de la cuenta.
   */
  async disable(): Promise<void> {
    await serverHttp.post("/auth/2fa/disable", {});
  }
}
