// src/shared/infrastructure/fetch-http-client.ts
import { HttpError, type HttpClient } from './http-client';

/**
 * Clase FetchHttpClient (Adaptador en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Implementa la interfaz `HttpClient` utilizando la API estándar `fetch`. Gestiona de manera centralizada
 *   la construcción de URLs, la serialización/deserialización de JSON, la inyección del encabezado `Authorization: Bearer <token>`
 *   y la captura y tipado de respuestas de error mediante `HttpError`.
 * - **¿Cómo interactúa con el sistema en general?**: Se instancia en el contenedor de inyección de dependencias del servidor
 *   (`http.server.ts`), vinculándose a la URL del backend (`getBackendUrl()`) y al extractor de token de cookies (`getSessionToken()`).
 *   Es inyectada en todos los repositorios HTTP de la capa de infraestructura.
 * - **¿Cuál es su importancia?**: Elimina la duplicación de código relacionada con cabeceras HTTP, autenticación y manejo de errores
 *   en todo el proyecto. Asegura que cada petición al backend incluya de forma transparente el token del usuario activo y
 *   garantiza un manejo homogéneo de respuestas vacías (como HTTP 204 en eliminaciones) y fallos de red.
 */
export class FetchHttpClient implements HttpClient {
  /**
   * Constructor de FetchHttpClient.
   *
   * @param baseUrl - URL base del backend (ej. `http://localhost:3001`).
   * @param getToken - Función proveedora del JWT actual (o null si es una petición pública o sin sesión).
   */
  constructor(
    private readonly baseUrl: string,
    private readonly getToken: () => string | null | Promise<string | null> = () => null,
  ) {}

  /** Realiza una petición HTTP GET a la ruta especificada. */
  get<T>(path: string) { return this.request<T>('GET', path); }

  /** Realiza una petición HTTP POST enviando un cuerpo JSON a la ruta especificada. */
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }

  /** Realiza una petición HTTP PATCH para actualizaciones parciales a la ruta especificada. */
  patch<T>(path: string, body: unknown) { return this.request<T>('PATCH', path, body); }

  /** Realiza una petición HTTP DELETE para eliminar recursos en la ruta especificada. */
  async delete(path: string) { await this.request<void>('DELETE', path); }

  /**
   * Método privado centralizado para ejecutar las peticiones HTTP.
   *
   * - **¿Qué hace?**: Resuelve el token asíncronamente, configura cabeceras (`Content-Type`, `Authorization`),
   *   ejecuta la llamada con `fetch`, parsea la respuesta si contiene cuerpo y lanza `HttpError` en códigos de estado no exitosos.
   * - **¿Cómo interactúa con el sistema en general?**: Es el embudo por el que transita toda comunicación entre el frontend de Next.js y el backend NestJS.
   * - **¿Cuál es su importancia?**: Centraliza la seguridad, cabeceras y control de excepciones HTTP en un único lugar comprobable y mantenible.
   */
  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    // 204 (DELETE / No Content) no trae cuerpo de respuesta
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!res.ok) throw new HttpError(res.status, data);
    return data as T;
  }
}
