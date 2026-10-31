// src/shared/di/http.server.ts
// Cliente HTTP para el SERVIDOR (Server Components, Server Actions, Route Handlers):
// llama al backend directamente y adjunta el JWT de la cookie de sesión.
import 'server-only';

import { FetchHttpClient } from '../infrastructure/fetch-http-client';
import { getBackendUrl } from '../infrastructure/backend-proxy';
import { getSessionToken } from '../infrastructure/session/session-cookie';

export const serverHttp = new FetchHttpClient(
  getBackendUrl(),
  async () => (await getSessionToken()) ?? null,
);
