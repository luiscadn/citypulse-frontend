// src/shared/infrastructure/backend-proxy.ts

/** Ruta de Next que reenvía al backend: /api/backend/users → {API_URL}/users */
export const BACKEND_PROXY_PATH = '/api/backend';

/** URL del backend NestJS. Solo se usa en el servidor (no lleva NEXT_PUBLIC_). */
export function getBackendUrl(): string {
  return (process.env.API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');
}
