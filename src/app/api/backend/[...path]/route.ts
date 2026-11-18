// src/app/api/backend/[...path]/route.ts
import type { NextRequest } from 'next/server';
import { getBackendUrl } from '@/shared/infrastructure/backend-proxy';
import { SESSION_COOKIE } from '@/shared/infrastructure/session/session-constants';

/**
 * Función forward (Proxy Inverso / BFF - Backend For Frontend)
 *
 * - **¿Qué hace?**: Recibe peticiones HTTP del navegador hacia `/api/backend/<subruta>`, reconstruye la URL destino
 *   hacia el backend NestJS (`API_URL/<subruta>`), lee la cookie `SESSION_COOKIE` (inaccesible desde JS del navegador por ser httpOnly),
 *   la inyecta en la cabecera `Authorization: Bearer <token>`, reenvía el cuerpo (body) y parámetros de consulta, y retorna
 *   la respuesta exacta del backend al cliente.
 * - **¿Cómo interactúa con el sistema en general?**: Actúa como puente seguro entre componentes del cliente (o hooks que hacen fetch)
 *   y el backend. Si el backend no responde o se produce un error de conexión, captura la excepción y retorna un JSON con estado HTTP 502 (Bad Gateway).
 * - **¿Cuál es su importancia?**: Implementa el patrón Backend For Frontend (BFF) y Reverse Proxy:
 *   1. Permite mantener la cookie del JWT estrictamente como `httpOnly`, blindando al sistema contra ataques de robo de sesión por XSS.
 *   2. Elimina cualquier problema de CORS (Cross-Origin Resource Sharing) en el navegador, ya que el navegador solo habla con su propio host Next.js.
 *   3. Oculta la topología de red real y puertos del backend.
 */
async function forward(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;
  const target = new URL(`${getBackendUrl()}/${path.map(encodeURIComponent).join('/')}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ['content-type', 'accept']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) headers.set('authorization', `Bearer ${token}`);

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      { statusCode: 502, message: 'No se pudo conectar con el backend', error: 'Bad Gateway' },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) responseHeaders.set('content-type', contentType);

  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
