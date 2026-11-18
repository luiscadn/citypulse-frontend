/**
 * @file venue.dto.ts
 * @description Data Transfer Objects (DTOs) para la comunicación HTTP con la API de Lugares (Venues).
 * Reflejan con fidelidad las respuestas y cuerpos JSON definidos en el backend NestJS (VenueController / VenueService).
 */

/**
 * DTO que representa un lugar tal como lo devuelve la API REST del backend.
 *
 * - **¿Qué hace?**:
 *   Estructura la carga útil JSON correspondiente al select de venue: id, nombre,
 *   descripción, dirección, verificación, objeto anidado de zona, objeto anidado de propietario
 *   y marcas de tiempo de creación/actualización.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Es recibido por `HttpVenueRepository` en llamadas GET/POST/PATCH
 *   y transformado hacia la entidad de dominio `Venue` mediante el mapper `toVenue`.
 *
 * - **¿Cuál es su importancia?**:
 *   Define el contrato de transporte entre el frontend Next.js y el microservicio/backend NestJS,
 *   garantizando tipado estricto de las respuestas de red.
 */
export interface VenueDto {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  isVerified: boolean;
  zone: { id: number; name: string };
  owner: { id: number; username: string; fullName: string };
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para la respuesta paginada del endpoint `GET /venues`.
 *
 * - **¿Qué hace?**:
 *   Estructura la respuesta de paginación del backend: array `data` de `VenueDto`,
 *   total de registros, página actual, límite por página y última página calculada.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Recibido por `HttpVenueRepository.list` y convertido en `VenuePage` mediante `toVenuePage`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite procesar de manera tipada los metadatos de paginación devueltos por NestJS.
 */
export interface VenuePageDto {
  data: VenueDto[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/**
 * DTO para el cuerpo de las peticiones `POST /venues` (creación) y `PATCH /venues/:id` (actualización).
 *
 * - **¿Qué hace?**:
 *   Define los campos exactos esperados por `CreateVenueDto` / `UpdateVenueDto` del backend:
 *   nombre, dirección, descripción opcional y ID de zona.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Generado por las funciones mappers `toCreateVenueBody` y `toUpdateVenueBody` a partir de un `VenueInput`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura que el payload JSON enviado al servidor cumpla con los esquemas de validación de NestJS (class-validator).
 */
export interface VenueBodyDto {
  name: string;
  address: string;
  description?: string | null;
  zoneId: number;
}
