import "server-only";

import { cookies } from "next/headers";
import { decodeJwt } from "./jwt";
import { SESSION_COOKIE } from "./session-constants";

/** Respaldo si el token no trae "exp": 1 día, igual que JWT_EXPIRES_IN del backend */
const FALLBACK_MAX_AGE_S = 60 * 60 * 24;

/**
 * Guarda el JWT en una cookie httpOnly: el JavaScript del navegador no puede
 * leerla (protege contra XSS) y solo viaja a este mismo sitio (sameSite=lax).
 * La cookie vence cuando vence el token.
 */
export async function setSessionToken(token: string): Promise<void> {
  const payload = decodeJwt(token);
  const maxAge = payload?.exp
    ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000))
    : FALLBACK_MAX_AGE_S;

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function clearSessionToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
