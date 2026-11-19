/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: DECODIFICAR TOKEN, VALIDAR TOKEN, DECODEJWT, READVALIDJWT,
 * EXPIRACIÓN TOKEN, CLAIMS, PAYLOAD JWT, BASE64URL, VERIFICAR JWT, SESIÓN EXPIRADA
 * =================================================================================================
 *
 * Módulo de Decodificación y Validación de Tokens JWT (Sin librerías externas / Edge Compatible)
 *
 * - **¿Dónde se valida el token y su expiración?**:
 *   En este archivo (`src/shared/infrastructure/session/jwt.ts`), mediante:
 *   - `decodeJwt(token)`: Parsea el segmento de payload Base64URL sin validar la firma criptográfica (esa la valida el backend).
 *   - `readValidJwt(token)`: Verifica que el token tenga formato válido de 3 partes y que `payload.exp * 1000 > Date.now()`.
 */
export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
  /** Expiración en segundos desde epoch */
  exp?: number;
  iat?: number;
}

/**
 * Función base64UrlDecode
 *
 * - **¿Qué hace?**: Decodifica una cadena en formato Base64URL a texto UTF-8 estándar, reemplazando caracteres seguros
 *   para URLs (`-` y `_` por `+` y `/`), aplicando el relleno necesario (`=`) y decodificando los bytes con `TextDecoder`.
 * - **¿Cómo interactúa con el sistema en general?**: Función auxiliar interna de `decodeJwt` para extraer y parsear
 *   el segmento de carga útil (payload) del JWT en cualquier entorno (Node.js, Edge Runtime, Navegador).
 * - **¿Cuál es su importancia?**: Permite decodificar tokens JWT de forma compatible con estándares web sin depender de librerías
 *   pesadas de Node.js (como `Buffer`), haciéndola apta para Edge Middleware y funciones serverless livianas.
 */
function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Función decodeJwt
 *
 * - **¿Qué hace?**: Recibe un token JWT en texto plano, valida que tenga las 3 partes estándar separadas por puntos (`header.payload.signature`),
 *   decodifica la sección central (payload) y valida que contenga los tipos mínimos requeridos (`sub: number`, `email: string`).
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada por `readValidJwt` y `setSessionToken` para inspeccionar la sesión
 *   sin necesidad de verificar la firma criptográfica (dado que el frontend no posee el secreto del backend).
 * - **¿Cuál es su importancia?**: Proporciona una forma no bloqueante y ligera de leer los datos de la sesión del usuario.
 *   Si el token está corrupto o mal formado, falla de forma segura retornando `null` en lugar de lanzar excepciones que rompan el renderizado.
 */
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

/**
 * Función isJwtExpired
 *
 * - **¿Qué hace?**: Determina si el timestamp de expiración (`exp`) del payload ya ha pasado respecto a un timestamp de referencia (`nowMs`),
 *   incorporando un margen de tolerancia defensivo de 5 segundos (clock skew).
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada en `readValidJwt` y en el middleware/proxy (`proxy.ts`) para decidir
 *   si la sesión aún es válida antes de permitir el acceso a rutas protegidas.
 * - **¿Cuál es su importancia?**: Evita enviar peticiones con tokens caducados que irremediablemente fallarían con HTTP 401 en el backend,
 *   mejorando la experiencia de usuario y reduciendo tráfico innecesario en la red.
 */
export function isJwtExpired(payload: JwtPayload, nowMs: number = Date.now()): boolean {
  if (payload.exp === undefined) return false;
  return payload.exp * 1000 <= nowMs + 5_000;
}

/**
 * Función readValidJwt
 *
 * - **¿Qué hace?**: Combina la decodificación (`decodeJwt`) y la comprobación de expiración (`isJwtExpired`) para retornar
 *   el payload del token únicamente si el token es estructuralmente válido y no ha expirado.
 * - **¿Cómo interactúa con el sistema en general?**: Es la función clave consumida por el middleware de Next.js (`proxy.ts`)
 *   para verificaciones optimistas de autenticación al navegar entre páginas.
 * - **¿Cuál es su importancia?**: Actúa como compuerta de acceso rápido a nivel de enrutamiento: permite redirigir de inmediato al
 *   login a usuarios con tokens ausentes, corruptos o expirados sin esperar a que el backend responda un 401.
 */
export function readValidJwt(token: string | undefined | null, nowMs?: number): JwtPayload | null {
  const payload = decodeJwt(token);
  if (!payload || isJwtExpired(payload, nowMs)) return null;
  return payload;
}
