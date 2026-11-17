import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { makeJwt, nowInSeconds } from "@/testing/jwt-factory";
import { SESSION_COOKIE } from "@/shared/infrastructure/session/session-constants";
import { proxy } from "./proxy";

const validToken = makeJwt({ sub: 4, email: "ana@citypulse.co", roles: ["USER"], exp: nowInSeconds() + 3600 });
const expiredToken = makeJwt({ sub: 4, email: "ana@citypulse.co", roles: ["USER"], exp: nowInSeconds() - 60 });

function request(path: string, token?: string) {
  const req = new NextRequest(new URL(path, "http://localhost:3000"));
  if (token) req.cookies.set(SESSION_COOKIE, token);
  return req;
}

describe("proxy", () => {
  it("deja pasar las rutas públicas sin sesión", () => {
    expect(proxy(request("/login")).headers.get("location")).toBeNull();
    expect(proxy(request("/register")).headers.get("location")).toBeNull();
  });

  it("sin sesión, la raíz lleva al login (sin ?from=)", () => {
    expect(proxy(request("/")).headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("manda a /login con ?from= si una ruta privada no tiene sesión", () => {
    const location = proxy(request("/events/mine?page=2")).headers.get("location");
    expect(location).toBe("http://localhost:3000/login?from=%2Fevents%2Fmine%3Fpage%3D2");
  });

  it("trata un token vencido como sin sesión y borra la cookie", () => {
    const response = proxy(request("/perfil", expiredToken));
    expect(response.headers.get("location")).toContain("/login");
    expect(response.cookies.get(SESSION_COOKIE)?.value).toBe("");
  });

  it("deja pasar una ruta privada con sesión vigente", () => {
    expect(proxy(request("/perfil", validToken)).headers.get("location")).toBeNull();
  });

  it("saca de /login a quien ya tiene sesión", () => {
    expect(proxy(request("/login", validToken)).headers.get("location")).toBe("http://localhost:3000/");
  });
});
