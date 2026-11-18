/**
 * @file two-factor-repository.ts
 * @description Puerto secundario (interfaz) para el servicio de Verificación en Dos Pasos (2FA).
 */

import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";

/**
 * Contrato para la administración del ciclo de vida de la autenticación de doble factor (TOTP).
 *
 * - **¿Qué hace?**:
 *   Declara las operaciones para generar el secreto y QR de enlace (`setup`), confirmar y habilitar
 *   el 2FA validando el primer código (`enable`), y deshabilitar el 2FA de la cuenta (`disable`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Implementado por `HttpTwoFactorRepository` y consumido por los casos de uso `SetupTwoFactorUseCase`,
 *   `EnableTwoFactorUseCase` y `DisableTwoFactorUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Aísla la lógica de enrolamiento y desenrolamiento criptográfico del protocolo HTTP.
 */
export interface TwoFactorRepository {
  /** Genera un nuevo secreto TOTP y su código QR sin activarlo aún. */
  setup(): Promise<TwoFactorSetup>;

  /** Activa la verificación en dos pasos validando un código TOTP de prueba. */
  enable(code: string): Promise<void>;

  /** Desactiva la verificación en dos pasos para el usuario en sesión. */
  disable(): Promise<void>;
}
