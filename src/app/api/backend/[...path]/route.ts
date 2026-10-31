// src/app/api/backend/[...path]/route.ts
// Puente navegador → backend (patrón "backend for frontend").
// El navegador llama a /api/backend/<ruta>; aquí se lee el JWT de la cookie
// httpOnly y se reenvía a {API_URL}/<ruta> con "Authorization: Bearer".
import type { NextRequest } from 'next/server';
import { getBackendUrl } from '@/shared/infrastructure/backend-proxy';
import { SESSION_COOKIE } from '@/shared/infrastructure/session/session-constants';

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
