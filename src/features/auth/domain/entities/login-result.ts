import type { SessionUser } from "./session-user";

/** Resultado de iniciar sesión: o hay sesión, o el backend pide el código 2FA. */
export type LoginResult =
  | { kind: "authenticated"; token: string; user: SessionUser }
  | { kind: "two-factor-required" };
