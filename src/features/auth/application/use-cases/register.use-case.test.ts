import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthRepository } from "../repositories/auth-repository";
import { RegisterUseCase } from "./register.use-case";
import {
  EmailAlreadyRegisteredError,
  InvalidRegistrationError,
} from "../../domain/errors/auth-errors";

describe("RegisterUseCase", () => {
  const authRepository = { login: vi.fn(), register: vi.fn() } satisfies AuthRepository;
  const loginUseCase = { execute: vi.fn() };
  const useCase = new RegisterUseCase(authRepository, loginUseCase);

  const valid = {
    email: "  Ana@CityPulse.co ",
    username: " ana_perez ",
    fullName: " Ana Pérez ",
    password: "Secreta123*",
  };

  // resetAllMocks (no clear): también borra los rechazos configurados en otros tests
  beforeEach(() => vi.resetAllMocks());

  it("normaliza los datos, registra e inicia sesión", async () => {
    loginUseCase.execute.mockResolvedValue({ kind: "authenticated", token: "jwt", user: {} });

    const result = await useCase.execute(valid);

    expect(authRepository.register).toHaveBeenCalledWith({
      email: "ana@citypulse.co",
      username: "ana_perez",
      fullName: "Ana Pérez",
      password: "Secreta123*",
    });
    expect(loginUseCase.execute).toHaveBeenCalledWith({
      email: "ana@citypulse.co",
      password: "Secreta123*",
    });
    expect(result).toEqual({ signedIn: true });
  });

  it("no llama al backend si los datos no son válidos", async () => {
    const attempt = useCase.execute({ ...valid, password: "corta", username: "a b" });

    await expect(attempt).rejects.toBeInstanceOf(InvalidRegistrationError);
    await attempt.catch((error: InvalidRegistrationError) => {
      expect(Object.keys(error.errors).sort()).toEqual(["password", "username"]);
    });
    expect(authRepository.register).not.toHaveBeenCalled();
  });

  it("propaga el error si el correo ya existe", async () => {
    authRepository.register.mockRejectedValue(new EmailAlreadyRegisteredError());

    await expect(useCase.execute(valid)).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
    expect(loginUseCase.execute).not.toHaveBeenCalled();
  });

  it("la cuenta queda creada aunque falle el inicio de sesión automático", async () => {
    loginUseCase.execute.mockRejectedValue(new Error("sin conexión"));

    await expect(useCase.execute(valid)).resolves.toEqual({ signedIn: false });
  });
});