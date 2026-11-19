/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: NOMBRE DE LA COOKIE, DÓNDE ESTÁ EL NOMBRE DEL TOKEN, CP_SESSION,
 * SESSION_COOKIE, CONSTANTE DE SESIÓN, IDENTIFICADOR COOKIE
 * =================================================================================================
 *
 * Constante SESSION_COOKIE: Nombre oficial de la cookie HTTP de sesión.
 *
 * - **¿Cómo se llama la cookie del token?**: `"cp_session"`.
 * - **¿Dónde está definida?**: En este archivo (`src/shared/infrastructure/session/session-constants.ts`).
 * - **¿Qué hace?**: Define el nombre literal de la cookie HTTP (`"cp_session"`) utilizada para almacenar el token JWT de sesión.
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada de forma coordinada por el proxy de Next.js (`src/proxy.ts`),
 *   las funciones de gestión de cookies (`session-cookie.ts`), el cliente HTTP del servidor (`http.server.ts`) y las Server Actions
 *   de autenticación (`auth.actions.ts`) para fijar, leer o destruir la sesión del usuario.
 * - **¿Cuál es su importancia?**: Evita discrepancias de nombres ("magic strings") entre diferentes capas del servidor (middleware,
 *   servicios e infraestructura), garantizando que todas las partes de la aplicación hagan referencia a la misma cookie de identidad.
 */
export const SESSION_COOKIE = "cp_session";
