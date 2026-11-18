// src/shared/di/http.server.ts
import 'server-only';

import { FetchHttpClient } from '../infrastructure/fetch-http-client';
import { getBackendUrl } from '../infrastructure/backend-proxy';
import { getSessionToken } from '../infrastructure/session/session-cookie';

/**
 * Instancia singleton serverHttp (Inyección de Dependencias para el Servidor)
 *
 * - **¿Qué hace?**: Instancia y exporta una única versión de `FetchHttpClient` configurada específicamente para el entorno servidor
 *   (Server Components, Server Actions y Route Handlers), inyectando dinámicamente el token JWT de la cookie en cada petición saliente.
 * - **¿Cómo interactúa con el sistema en general?**: Es el punto de inyección central que consumen todos los contenedores de dependencias
 *   por feature (`auth.container.ts`, `events.container.ts`, `venue.container.ts`, etc.) para crear sus repositorios HTTP en el servidor.
 *   Utiliza la directiva import `'server-only'` para asegurar que el bundler lance error de compilación si algún componente de cliente
 *   intenta importarlo por accidente.
 * - **¿Cuál es su importancia?**: Garantiza seguridad absoluta al impedir que secretos de servidor o cookies httpOnly se filtren al bundle
 *   del navegador. Además, centraliza la inyección de dependencias de la infraestructura HTTP en un único objeto reutilizable.
 */
export const serverHttp = new FetchHttpClient(
  getBackendUrl(),
  async () => (await getSessionToken()) ?? null,
);
