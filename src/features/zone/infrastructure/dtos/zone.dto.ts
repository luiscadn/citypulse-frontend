/**
 * DTO de Respuesta ZoneDto (Data Transfer Object)
 *
 * - **¿Qué hace?**: Modela la estructura JSON exacta que devuelve el backend NestJS al consultar `GET /zone` o `GET /zone/:id`.
 *   Contiene `id`, `name`, `description`, `createdAt` y la relación opcional `parent`.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Infraestructura. Es consumido por
 *   `HttpZoneRepository` y transformado a la entidad de dominio `Zone` mediante el mapper `toZone`.
 * - **¿Cuál es su importancia?**: Aísla el modelo de dominio interno de las variaciones o particularidades del contrato
 *   de serialización del backend.
 */
export interface ZoneDto {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  /** Hoy el backend no carga la relación; si algún día la envía, se usa. */
  parent?: { id: number } | null;
}

/**
 * DTO de Solicitud ZoneBodyDto
 *
 * - **¿Qué hace?**: Representa el payload JSON enviado en los cuerpos de las peticiones `POST /zone` (creación)
 *   y `PATCH /zone/:id` (actualización).
 * - **¿Cómo interactúa con el sistema en general?**: Es generado por las funciones de mapeo `toCreateZoneBody`
 *   y `toUpdateZoneBody` a partir de un `ZoneInput`.
 * - **¿Cuál es su importancia?**: Garantiza que el JSON saliente coincida estrictamente con las clases `CreateZoneDto`
 *   y `UpdateZoneDto` que valida `ValidationPipe` en el backend NestJS.
 */
export interface ZoneBodyDto {
  name: string;
  description?: string | null;
  parentZoneId?: number;
}
