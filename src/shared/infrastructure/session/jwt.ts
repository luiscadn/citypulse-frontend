/**
 * Lee el payload de un JWT SIN verificar la firma.
 *
 * El frontend no tiene el JWT_SECRET del backend, así que no puede verificar
 * el token: esto solo sirve para chequeos optimistas (¿hay sesión?, ¿expiró?)
 * en proxy.ts y en la UI. Quien decide de verdad es el backend, que valida
 * la firma en cada petición y responde 401 si el token no sirve.
 */
export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
  /** Expiración en segundos desde epoch */
  exp?: number;
  iat?: number;
}

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwt(token: string | undefined | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (typeof payload?.sub !== "number" || typeof payload?.email !== "string") return null;
    return {
      ...payload,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
    };
  } catch {
    return null;
  }
}

/** true si el token tiene "exp" y ya pasó (con un margen de 5 s) */
export function isJwtExpired(payload: JwtPayload, nowMs: number = Date.now()): boolean {
  if (payload.exp === undefined) return false;
  return payload.exp * 1000 <= nowMs + 5_000;
}

/** Payload solo si el token es legible y no ha expirado */
export function readValidJwt(token: string | undefined | null, nowMs?: number): JwtPayload | null {
  const payload = decodeJwt(token);
  if (!payload || isJwtExpired(payload, nowMs)) return null;
  return payload;
}
