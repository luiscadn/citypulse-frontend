// src/shared/infrastructure/session/session-cookie.ts
/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: TOKEN, DÓNDE ESTÁ EL TOKEN, DÓNDE SE GUARDA EL TOKEN, COOKIE,
 * HTTPONLY, JWT, SESSION_COOKIE, SETSESSIONTOKEN, GETSESSIONTOKEN, CLEARSESSIONTOKEN, SEGURIDAD, XSS, CSRF
 * =================================================================================================
 *
 * Módulo de Gestión de Cookies de Sesión (Almacenamiento Seguro del Token JWT)
 *
 * - **¿Dónde se guarda el token JWT en el frontend?**:
 *   Se almacena en una cookie del navegador llamada `citypulse_session` configurada con:
 *   1. `httpOnly: true`: Inaccesible desde scripts de cliente (`document.cookie`), protegiéndolo de ataques XSS.
 *   2. `sameSite: "lax"`: Previene ataques de falsificación de peticiones en sitios cruzados (CSRF).
 *   3. `secure: true` (en producción): Solo viaja a través de conexiones cifradas HTTPS.
 *   4. `maxAge`: Sincronizado dinámicamente con el tiempo de vida remanente del JWT (`payload.exp`).
 */

import "server-only";

import { cookies } from "next/headers";
import { decodeJwt } from "./jwt";
import { SESSION_COOKIE } from "./session-constants";

/**
 * Constante FALLBACK_MAX_AGE_S: Tiempo de vida de respaldo para la cookie (24 horas).
 *
 * - **¿Qué hace?**: Proporciona una duración por defecto en segundos (86400 s = 1 día) en caso de que el JWT no incluya el claim `exp`.
 * - **¿Cómo interactúa con el sistema en general?**: Se sincroniza con la configuración de expiración de tokens del backend (`JWT_EXPIRES_IN`).
 * - **¿Cuál es su importancia?**: Previene que una cookie de sesión quede sin tiempo de expiración (sesión de navegador indefinida) si el token carece de metadata explícita.
 */
const FALLBACK_MAX_AGE_S = 60 * 60 * 24;

/**
 * Función setSessionToken
 *
 * - **¿Qué hace?**: Almacena el JWT en una cookie HTTP (`SESSION_COOKIE`) con banderas estrictas de seguridad:
 *   `httpOnly` (inaccesible desde JavaScript en el navegador), `secure` (en producción), `sameSite: "lax"` (protección CSRF),
 *   y tiempo de vida sincronizado con la fecha de expiración del token (`maxAge`).
 * - **¿Cómo interactúa con el sistema en general?**: Es invocada durante los flujos de inicio de sesión exitoso o verificación 2FA
 *   desde las Server Actions (`auth.actions.ts`) y use cases de autenticación.
 * - **¿Cuál es su importancia?**: Mitiga vulnerabilidades críticas de robo de sesión como Cross-Site Scripting (XSS)
 *   al impedir el acceso al token mediante `document.cookie`, y previene ataques Cross-Site Request Forgery (CSRF).
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

/**
 * Función getSessionToken
 *
 * - **¿Qué hace?**: Recupera de manera asíncrona el valor en texto plano del token JWT almacenado en la cookie del cliente.
 * - **¿Cómo interactúa con el sistema en general?**: Es consumida por el cliente HTTP del servidor (`http.server.ts`),
 *   el extractor de usuario actual (`get-current-user.ts`), y los casos de uso que requieran consultar el token en el servidor.
 * - **¿Cuál es su importancia?**: Proporciona un punto de acceso centralizado y desacoplado a las cabeceras de Next.js (`next/headers`)
 *   para obtener las credenciales de autorización sin exponer la API interna de cookies en el resto de la aplicación.
 */
export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/**
 * Función clearSessionToken
 *
 * - **¿Qué hace?**: Elimina de forma inmediata la cookie `SESSION_COOKIE` de los encabezados de respuesta.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta durante el caso de uso de cierre de sesión (`LogoutUseCase`),
 *   cuando el proxy detecta un token inválido/vencido (`proxy.ts`), o tras un fallo de autenticación irreparable.
 * - **¿Cuál es su importancia?**: Garantiza la invalidación inmediata de la sesión en el cliente, evitando que se sigan enviando
 *   tokens caducados o revocados hacia el backend.
 */
export async function clearSessionToken(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
