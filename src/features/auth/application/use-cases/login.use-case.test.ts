import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthRepository } from "../repositories/auth-repository";
import type { SessionStore } from "../repositories/session-store";
import { LoginUseCase } from "./login.use-case";
import { LogoutUseCase } from "./logout.use-case";
import { InvalidCredentialsError } from "../../domain/errors/auth-errors";

describe("LoginUseCase", () => {
  const authRepository = { login: vi.fn(), register: vi.fn() } satisfies AuthRepository;
  const sessionStore = { save: vi.fn(), clear: vi.fn() } satisfies SessionStore;
  const useCase = new LoginUseCase(authRepository, sessionStore);

  beforeEach(() => vi.clearAllMocks());

  it("guarda el token cuando el login es exitoso", async () => {
    authRepository.login.mockResolvedValue({
      kind: "authenticated",
      token: "jwt",
      user: { id: 4, email: "ana@citypulse.co", roles: ["USER"] },
    });

    const result = await useCase.execute({ email: "ana@citypulse.co", password: "User123*" });

    expect(result.kind).toBe("authenticated");
    expect(sessionStore.save).toHaveBeenCalledWith("jwt");
  });

  it("normaliza el correo (espacios y mayúsculas)", async () => {
    authRepository.login.mockResolvedValue({ kind: "two-factor-required" });
    await useCase.execute({ email: "  Ana@CityPulse.co ", password: "x" });
    expect(authRepository.login).toHaveBeenCalledWith({ email: "ana@citypulse.co", password: "x" });
  });

  it("no guarda nada si el backend pide el código 2FA", async () => {
    authRepository.login.mockResolvedValue({ kind: "two-factor-required" });
    const result = await useCase.execute({ email: "a@b.co", password: "x" });
    expect(result).toEqual({ kind: "two-factor-required" });
    expect(sessionStore.save).not.toHaveBeenCalled();
  });

  it("propaga el error de credenciales sin guardar sesión", async () => {
    authRepository.login.mockRejectedValue(new InvalidCredentialsError());
    await expect(useCase.execute({ email: "a@b.co", password: "mal" })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(sessionStore.save).not.toHaveBeenCalled();
  });
});

describe("LogoutUseCase", () => {
  it("borra la sesión", async () => {
    const sessionStore = { save: vi.fn(), clear: vi.fn().mockResolvedValue(undefined) };
    await new LogoutUseCase(sessionStore).execute();
    expect(sessionStore.clear).toHaveBeenCalled();
  });
});
