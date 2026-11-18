// src/shared/infrastructure/http-client.ts

/**
 * Interfaz HttpClient (Puerto en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Define el contrato abstracto para la ejecución de operaciones HTTP básicas (`GET`, `POST`, `PATCH`, `DELETE`).
 * - **¿Cómo interactúa con el sistema en general?**: Es la abstracción de la que dependen todas las implementaciones de repositorios
 *   HTTP en la capa de infraestructura (`HttpAuthRepository`, `HttpEventRepository`, `HttpVenueRepository`, etc.).
 *   Su implementación concreta predeterminada es `FetchHttpClient`.
 * - **¿Cuál es su importancia?**: Cumple con el Principio de Inversión de Dependencias (DIP de SOLID). Los repositorios no dependen
 *   directamente de `fetch` ni de librerías externas como `axios`, lo que facilita mockear la comunicación HTTP en pruebas unitarias
 *   y cambiar el cliente subyacente sin alterar la lógica de negocio.
 */
export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  patch<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

/**
 * Clase HttpError: Representación de errores de transporte y respuestas de error HTTP.
 *
 * - **¿Qué hace?**: Encapsula el código de estado HTTP numérico (`status`) y el cuerpo JSON (`body`) devuelto por el backend NestJS
 *   (generalmente con estructura `{ statusCode, message, error }`).
 * - **¿Cómo interactúa con el sistema en general?**: Es lanzada por `FetchHttpClient` cuando `response.ok` es falso (`status >= 400`).
 *   Es capturada en las Server Actions (`action-error.ts`) o en los repositorios HTTP para traducir los códigos HTTP (400, 401, 403, 404, 409)
 *   hacia errores tipados de dominio (`DomainError`) o mensajes amigables para el usuario.
 * - **¿Cuál es su importancia?**: Proporciona trazabilidad completa del fallo HTTP preservando los detalles de validación del backend,
 *   permitiendo a las capas superiores tomar decisiones informadas (ej. reautenticar al usuario en un 401 o mostrar mensajes de validación específicos en un 400).
 */
export class HttpError extends Error {
  constructor(readonly status: number, readonly body: unknown) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}
