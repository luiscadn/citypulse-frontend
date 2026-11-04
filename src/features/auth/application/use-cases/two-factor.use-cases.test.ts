import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TwoFactorRepository } from "../repositories/two-factor-repository";
import { EnableTwoFactorUseCase } from "./two-factor.use-cases";
import { InvalidTwoFactorCodeError } from "../../domain/errors/auth-errors";

describe("EnableTwoFactorUseCase", () => {
  const twoFactor = { setup: vi.fn(), enable: vi.fn(), disable: vi.fn() } satisfies TwoFactorRepository;
  const useCase = new EnableTwoFactorUseCase(twoFactor);

  beforeEach(() => vi.clearAllMocks());

  it("quita los espacios del código antes de enviarlo", async () => {
    await useCase.execute("123 456");
    expect(twoFactor.enable).toHaveBeenCalledWith("123456");
  });

  it("rechaza códigos que no son de 6 dígitos sin llamar al backend", async () => {
    await expect(useCase.execute("12345")).rejects.toBeInstanceOf(InvalidTwoFactorCodeError);
    await expect(useCase.execute("abcdef")).rejects.toBeInstanceOf(InvalidTwoFactorCodeError);
    expect(twoFactor.enable).not.toHaveBeenCalled();
  });
});