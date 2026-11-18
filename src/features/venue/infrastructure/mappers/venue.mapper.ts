/**
 * @file venue.mapper.ts
 * @description Mapeadores de Infraestructura para transformar entre DTOs de red y Entidades de Dominio de Venues.
 * Implementa el patrón Anti-Corruption Layer (ACL) aislando el dominio de cambios en la API externa.
 */

import type { Venue, VenueInput, VenuePage } from "../../domain/entities/venue";
import type { VenueBodyDto, VenueDto, VenuePageDto } from "../dtos/venue.dto";

/**
 * Transforma un DTO `VenueDto` en una entidad inmutable de dominio `Venue`.
 *
 * - **¿Qué hace?**:
 *   Mapea los campos planos y anidados, asegurando valores por defecto (`null` para textos ausentes)
 *   y filtrando información innecesaria del dueño (conservando solo `id`, `username` y `fullName`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el puente principal utilizado por todos los métodos de `HttpVenueRepository` para entregar entidades puras al dominio.
 *
 * - **¿Cuál es su importancia?**:
 *   Protege al dominio de cambios en el esquema del backend (por ejemplo si el backend renombra columnas o añade campos sensibles).
 */
export function toVenue(dto: VenueDto): Venue {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    address: dto.address ?? null,
    isVerified: dto.isVerified,
    zone: { id: dto.zone.id, name: dto.zone.name },
    owner: { id: dto.owner.id, username: dto.owner.username, fullName: dto.owner.fullName },
    createdAt: dto.createdAt,
  };
}

/**
 * Transforma un DTO paginado `VenuePageDto` en un objeto de dominio `VenuePage`.
 *
 * - **¿Qué hace?**:
 *   Convierte la lista de DTOs en entidades `Venue` y normaliza `lastPage` para que nunca sea menor a 1
 *   (ya que si la consulta no tiene resultados, el backend devuelve 0 pero la UI requiere al menos página 1).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en `HttpVenueRepository.list` antes de retornar los datos al caso de uso `ListVenuesUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Evita inconsistencias visuales en el componente de paginación (`Página 1 de 0`), normalizando la UX.
 */
export function toVenuePage(dto: VenuePageDto): VenuePage {
  return {
    venues: dto.data.map(toVenue),
    total: dto.total,
    page: dto.page,
    lastPage: Math.max(dto.lastPage, 1),
  };
}

/**
 * Transforma un `VenueInput` validado de dominio en el payload de creación `VenueBodyDto`.
 *
 * - **¿Qué hace?**:
 *   Copia nombre, dirección y zona, y solo incluye la propiedad `description` si contiene un texto no vacío.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en `HttpVenueRepository.create` al realizar peticiones `POST /venues`.
 *
 * - **¿Cuál es su importancia?**:
 *   Evita enviar campos vacíos o `undefined` que puedan fallar las validaciones estrictas del backend al registrar.
 */
export function toCreateVenueBody(input: VenueInput): VenueBodyDto {
  return {
    name: input.name,
    address: input.address,
    zoneId: input.zoneId,
    ...(input.description && { description: input.description }),
  };
}

/**
 * Transforma un `VenueInput` en el payload de actualización `VenueBodyDto`.
 *
 * - **¿Qué hace?**:
 *   Copia todos los campos incluyendo explícitamente `description` (que puede ser `null` si se desea borrar).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en `HttpVenueRepository.update` al invocar `PATCH /venues/:id`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite limpiar descripciones existentes enviando `null` al backend, diferenciando claramente creación de edición.
 */
export function toUpdateVenueBody(input: VenueInput): VenueBodyDto {
  return {
    name: input.name,
    address: input.address,
    zoneId: input.zoneId,
    description: input.description,
  };
}
