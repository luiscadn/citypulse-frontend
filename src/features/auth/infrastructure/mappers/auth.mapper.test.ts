import { describe, expect, it } from "vitest";
import { toLoginRequestDto, toLoginResult, toRoles } from "./auth.mapper";

describe("auth.mapper", () => {
  it("convierte la respuesta exitosa del backend en un LoginResult autenticado", () => {
    const result = toLoginResult({
      token: "jwt",
      user_id: 4,
      email: "ana@citypulse.co",
      roles: ["USER"],
    });
    expect(result).toEqual({
      kind: "authenticated",
      token: "jwt",
      user: { id: 4, email: "ana@citypulse.co", roles: ["USER"] },
    });
  });

  it("reconoce cuando el backend pide el código 2FA", () => {
    expect(toLoginResult({ requires2FA: true, message: "..." })).toEqual({
      kind: "two-factor-required",
    });
  });

  it("descarta roles que el frontend no conoce", () => {
    expect(toRoles(["ADMIN", "SUPERHEROE", "USER"])).toEqual(["ADMIN", "USER"]);
  });

  it("solo envía twoFactorCode si viene", () => {
    expect(toLoginRequestDto({ email: "a@b.co", password: "x" })).toEqual({
      email: "a@b.co",
      password: "x",
    });
    expect(toLoginRequestDto({ email: "a@b.co", password: "x", twoFactorCode: "123456" }))
      .toHaveProperty("twoFactorCode", "123456");
  });
});
