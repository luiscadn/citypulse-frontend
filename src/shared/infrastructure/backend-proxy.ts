// src/shared/infrastructure/backend-proxy.ts

/**
 * Constante BACKEND_PROXY_PATH
 *
 * - **¿Qué hace?**: Define el prefijo de ruta `/api/backend` dentro del enrutador de Next.js.
 * - **¿Cómo interactúa con el sistema en general?**: Apunta a la ruta catch-all de Route Handlers (`src/app/api/backend/[...path]/route.ts`).
 *   Es empleada cuando el cliente necesita hacer llamadas al backend pasando por el proxy del servidor Next.js.
 * - **¿Cuál es su importancia?**: Evita problemas de CORS en el navegador y oculta la ubicación física real del backend a los clientes web.
 */
export const BACKEND_PROXY_PATH = '/api/backend';

/**
 * Función getBackendUrl
 *
 * - **¿Qué hace?**: Obtiene la URL base del backend NestJS desde la variable de entorno `API_URL` (con fallback a `http://localhost:3001`),
 *   eliminando cualquier barra diagonal final (`/`).
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza exclusivamente en el entorno de servidor (Server Components, Server Actions,
 *   Route Handlers y `http.server.ts`). Al no tener el prefijo `NEXT_PUBLIC_`, jamás se expone al bundle de JavaScript del navegador.
 * - **¿Cuál es su importancia?**: Protege la arquitectura de red interna, permite configurar entornos fácilmente mediante variables de entorno
 *   (desarrollo, staging, producción/docker) y previene errores de concatenación de URLs provocados por barras diagonales duplicadas.
 */
export function getBackendUrl(): string {
  return (process.env.API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');
}
