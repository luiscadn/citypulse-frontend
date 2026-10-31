// src/shared/infrastructure/http-client.ts
export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  patch<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

/** Error HTTP crudo (status + body del backend NestJS: { statusCode, message, error }). */
export class HttpError extends Error {
  constructor(readonly status: number, readonly body: unknown) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}
