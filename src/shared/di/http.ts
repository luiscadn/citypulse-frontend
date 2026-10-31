// src/shared/di/http.ts
// Cliente HTTP para el NAVEGADOR (Client Components / hooks).
//
// El JWT vive en una cookie httpOnly que el JavaScript del navegador no puede
// leer. Por eso el navegador no llama al backend directamente: llama a
// /api/backend/* (Route Handler de Next), que lee la cookie y reenvía la
// petición al backend con "Authorization: Bearer <token>".
//
// En Server Components y Server Actions usa `serverHttp` (shared/di/http.server.ts).
import { FetchHttpClient } from '../infrastructure/fetch-http-client';
import { BACKEND_PROXY_PATH } from '../infrastructure/backend-proxy';

export const http = new FetchHttpClient(BACKEND_PROXY_PATH);
