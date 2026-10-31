import { describe, expect, it } from "vitest";
import { makeJwt, nowInSeconds } from "@/testing/jwt-factory";
import { decodeJwt, isJwtExpired, readValidJwt } from "./jwt";

describe("decodeJwt", () => {
  it("lee sub, email y roles del payload", () => {
    const token = makeJwt({ sub: 4, email: "ana@citypulse.co", roles: ["USER"] });
    expect(decodeJwt(token)).toMatchObject({ sub: 4, email: "ana@citypulse.co", roles: ["USER"] });
  });

  it("decodifica caracteres no ASCII", () => {
    const token = makeJwt({ sub: 1, email: "josé@citypulse.co", roles: [] });
    expect(decodeJwt(token)?.email).toBe("josé@citypulse.co");
  });

  it.each([undefined, null, "", "no-es-un-jwt", "a.b.c", makeJwt({ email: "x" })])(
    "devuelve null para un token inválido (%s)",
    (token) => expect(decodeJwt(token)).toBeNull(),
  );

  it("usa [] si roles no es un arreglo", () => {
    expect(decodeJwt(makeJwt({ sub: 1, email: "a@b.co" }))?.roles).toEqual([]);
  });
});

describe("isJwtExpired / readValidJwt", () => {
  it("un token vigente es válido", () => {
    const token = makeJwt({ sub: 1, email: "a@b.co", roles: [], exp: nowInSeconds() + 3600 });
    expect(readValidJwt(token)).not.toBeNull();
  });

  it("un token vencido no es válido", () => {
    const token = makeJwt({ sub: 1, email: "a@b.co", roles: [], exp: nowInSeconds() - 1 });
    expect(readValidJwt(token)).toBeNull();
  });

  it("aplica un margen de 5 s antes de la expiración", () => {
    const now = 1_000_000_000_000;
    expect(isJwtExpired({ sub: 1, email: "", roles: [], exp: now / 1000 + 3 }, now)).toBe(true);
    expect(isJwtExpired({ sub: 1, email: "", roles: [], exp: now / 1000 + 10 }, now)).toBe(false);
  });

  it("sin exp se considera vigente", () => {
    expect(isJwtExpired({ sub: 1, email: "", roles: [] })).toBe(false);
  });
});
