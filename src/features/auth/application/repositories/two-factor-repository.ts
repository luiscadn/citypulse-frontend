import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";

/** Puerto: administrar la verificación en dos pasos del usuario con sesión. */
export interface TwoFactorRepository {
  /** Genera un secreto nuevo y su QR. Aún no activa el 2FA. */
  setup(): Promise<TwoFactorSetup>;
  /** Activa el 2FA comprobando un código TOTP de la app autenticadora. */
  enable(code: string): Promise<void>;
  disable(): Promise<void>;
}