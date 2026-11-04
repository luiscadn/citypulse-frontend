import { describe, expect, it } from "vitest";
import { validateRegistration } from "@/features/auth/domain/rules/registration";
import { validateProfile } from "./profile";
import { validateEmail, validatePassword, validateUsername } from "./user-fields";

describe("reglas de campos de usuario", () => {
  it("valida el correo", () => {
    expect(validateEmail("ana@citypulse.co")).toBeUndefined();
    expect(validateEmail("ana@")).toBeDefined();
    expect(validateEmail("")).toBeDefined();
  });

  it("valida el nombre de usuario como el backend (letras, números, . _ -)", () => {
    expect(validateUsername("ana_perez.01")).toBeUndefined();
    expect(validateUsername("ab")).toBeDefined();
    expect(validateUsername("ana perez")).toBeDefined();
    expect(validateUsername("a".repeat(61))).toBeDefined();
  });

  it("exige contraseña de 8 a 72 caracteres", () => {
    expect(validatePassword("1234567")).toBeDefined();
    expect(validatePassword("12345678")).toBeUndefined();
    expect(validatePassword("x".repeat(73))).toBeDefined();
  });
});

describe("validateRegistration", () => {
  it("no devuelve errores con datos válidos", () => {
    expect(
      validateRegistration({
        email: "ana@citypulse.co",
        username: "ana_perez",
        fullName: "Ana Pérez",
        password: "Secreta123*",
      }),
    ).toEqual({});
  });

  it("devuelve un error por cada campo inválido", () => {
    const errors = validateRegistration({ email: "x", username: "", fullName: "A", password: "1" });
    expect(Object.keys(errors).sort()).toEqual(["email", "fullName", "password", "username"]);
  });
});

describe("validateProfile", () => {
  it("valida nombre completo y usuario", () => {
    expect(validateProfile({ fullName: "Ana Pérez", username: "ana_perez" })).toEqual({});
    expect(Object.keys(validateProfile({ fullName: "", username: "a b" })).sort()).toEqual([
      "fullName",
      "username",
    ]);
  });
});