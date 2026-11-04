import type { TwoFactorSetup } from "../../domain/entities/two-factor-setup";
import { InvalidTwoFactorCodeError } from "../../domain/errors/auth-errors";
import type { TwoFactorRepository } from "../repositories/two-factor-repository";

/** Paso 1: genera el secreto y el QR para la app autenticadora. */
export class SetupTwoFactorUseCase {
  constructor(private readonly twoFactor: TwoFactorRepository) {}

  execute(): Promise<TwoFactorSetup> {
    return this.twoFactor.setup();
  }
}

/** Paso 2: activa el 2FA con el primer código que muestra la app. */
export class EnableTwoFactorUseCase {
  constructor(private readonly twoFactor: TwoFactorRepository) {}

  async execute(code: string): Promise<void> {
    const clean = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(clean)) throw new InvalidTwoFactorCodeError("El código tiene 6 dígitos");
    await this.twoFactor.enable(clean);
  }
}

export class DisableTwoFactorUseCase {
  constructor(private readonly twoFactor: TwoFactorRepository) {}

  execute(): Promise<void> {
    return this.twoFactor.disable();
  }
}