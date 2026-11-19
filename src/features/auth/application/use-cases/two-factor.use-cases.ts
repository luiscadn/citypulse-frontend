/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: 2FA, TWO FACTOR, TOTP, CÓDIGO QR, SEGUNDO FACTOR,
 * SETUPTWOFACTORUSECASE, ENABLETWOFACTORUSECASE, DISABLETWOFACTORUSECASE, AUTENTICADOR
 * =================================================================================================
 *
 * @file two-factor.use-cases.ts
 * @description Casos de uso para el flujo completo de Verificación en Dos Pasos (2FA / TOTP):
 * generación de secreto y QR, confirmación/activación, y desactivación.
 */

import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";
import { InvalidTwoFactorCodeError } from "../../domain/errors/auth-errors";
import type { TwoFactorRepository } from "../repositories/two-factor-repository";

/**
 * Caso de uso: Paso 1 del enrolamiento 2FA (Generación de secreto y QR).
 *
 * - **¿Qué hace?**: Solicita al repositorio generar un nuevo secreto TOTP y el Data URL del código QR.
 * - **¿Cómo interactúa con el sistema en general?**: Invocado por `startTwoFactorAction` desde el panel de perfil.
 * - **¿Cuál es su importancia?**: Provee las credenciales requeridas para sincronizar la app autenticadora.
 */
export class SetupTwoFactorUseCase {
  constructor(private readonly twoFactor: TwoFactorRepository) {}

  execute(): Promise<TwoFactorSetup> {
    return this.twoFactor.setup();
  }
}

/**
 * Caso de uso: Paso 2 del enrolamiento 2FA (Validación y activación definitiva).
 *
 * - **¿Qué hace?**:
 *   Limpia espacios del código, valida que sean exactamente 6 dígitos numéricos (lanzando `InvalidTwoFactorCodeError` si no),
 *   y envía el código de confirmación al repositorio para activar el 2FA de la cuenta.
 *
 * - **¿Cómo interactúa con el sistema en general?**: Invocado por `enableTwoFactorAction`.
 * - **¿Cuál es su importancia?**: Garantiza que el usuario solo active el 2FA si logró sincronizar exitosamente su aplicación.
 */
export class EnableTwoFactorUseCase {
  constructor(private readonly twoFactor: TwoFactorRepository) {}

  async execute(code: string): Promise<void> {
    const clean = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(clean)) throw new InvalidTwoFactorCodeError("El código tiene 6 dígitos");
    await this.twoFactor.enable(clean);
  }
}

/**
 * Caso de uso: Desactivación de la verificación en dos pasos.
 *
 * - **¿Qué hace?**: Solicita al repositorio remover la protección 2FA de la cuenta del usuario en sesión.
 * - **¿Cómo interactúa con el sistema en general?**: Invocado por `disableTwoFactorAction`.
 * - **¿Cuál es su importancia?**: Permite al usuario regresar a la autenticación de factor único cuando lo requiera.
 */
export class DisableTwoFactorUseCase {
  constructor(private readonly twoFactor: TwoFactorRepository) {}

  execute(): Promise<void> {
    return this.twoFactor.disable();
  }
}
