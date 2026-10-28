// src/shared/infrastructure/fetch-http-client.ts
import { HttpError, type HttpClient } from './http-client';

export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    /** Devuelve el JWT actual (o null). Lo provee la feature de auth. */
    private readonly getToken: () => string | null = () => null,
  ) {}

  get<T>(path: string) { return this.request<T>('GET', path); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
  patch<T>(path: string, body: unknown) { return this.request<T>('PATCH', path, body); }
  async delete(path: string) { await this.request<void>('DELETE', path); }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    // 204 (DELETE) no trae body
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!res.ok) throw new HttpError(res.status, data);
    return data as T;
  }
}
