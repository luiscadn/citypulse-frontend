/**
 * Constante SESSION_COOKIE
 *
 * - **¿Qué hace?**: Define el nombre literal de la cookie HTTP (`"cp_session"`) utilizada para almacenar el token JWT de sesión.
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada de forma coordinada por el proxy de Next.js (`src/proxy.ts`),
 *   las funciones de gestión de cookies (`session-cookie.ts`), el cliente HTTP del servidor (`http.server.ts`) y las Server Actions
 *   de autenticación (`auth.actions.ts`) para fijar, leer o destruir la sesión del usuario.
 * - **¿Cuál es su importancia?**: Evita discrepancias de nombres ("magic strings") entre diferentes capas del servidor (middleware,
 *   servicios e infraestructura), garantizando que todas las partes de la aplicación hagan referencia a la misma cookie de identidad.
 */
export const SESSION_COOKIE = "cp_session";
