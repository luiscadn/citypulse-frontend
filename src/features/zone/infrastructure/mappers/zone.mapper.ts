import type { Zone, ZoneInput } from "../../domain/entities/zone";
import type { ZoneBodyDto, ZoneDto } from "../dtos/zone.dto";

/**
 * Función toZone (Mapper DTO -> Entidad de Dominio)
 *
 * - **¿Qué hace?**: Transforma un objeto `ZoneDto` recibido del backend en una entidad pura `Zone` del dominio,
 *   mapeando la relación opcional `parent?.id` al atributo plano `parentId`.
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada por los métodos de `HttpZoneRepository`
 *   al recibir respuestas exitosas del backend.
 * - **¿Cuál es su importancia?**: Desacopla la capa de dominio de la estructura física del backend,
 *   garantizando que el resto de la aplicación trabaje con tipos estables e inmutables.
 */
export function toZone(dto: ZoneDto): Zone {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    parentId: dto.parent?.id ?? null,
    createdAt: dto.createdAt,
  };
}

/**
 * Función toCreateZoneBody (Mapper Entidad -> DTO de Creación)
 *
 * - **¿Qué hace?**: Construye el payload `ZoneBodyDto` para la creación (`POST /zone`), omitiendo campos vacíos
 *   para que el backend aplique sus valores por defecto (`null`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumida por `HttpZoneRepository.create`.
 * - **¿Cuál es su importancia?**: Evita enviar cadenas vacías o campos innecesarios que puedan confundir los decoradores
 *   de validación del backend.
 */
export function toCreateZoneBody(input: ZoneInput): ZoneBodyDto {
  return {
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.parentZoneId && { parentZoneId: input.parentZoneId }),
  };
}

/**
 * Función toUpdateZoneBody (Mapper Entidad -> DTO de Edición)
 *
 * - **¿Qué hace?**: Construye el payload `ZoneBodyDto` para la edición (`PATCH /zone/:id`).
 *   Envía explícitamente `description` (para permitir borrarla si es `null`) e incluye `parentZoneId`
 *   únicamente si se seleccionó una zona padre válida (el backend rechaza `parentZoneId: null` al actualizar).
 * - **¿Cómo interactúa con el sistema en general?**: Consumida por `HttpZoneRepository.update`.
 * - **¿Cuál es su importancia?**: Resuelve particularidades semánticas del backend NestJS respecto al borrado
 *   o preservación de relaciones foráneas durante operaciones PATCH.
 */
export function toUpdateZoneBody(input: ZoneInput): ZoneBodyDto {
  return {
    name: input.name,
    description: input.description,
    ...(input.parentZoneId && { parentZoneId: input.parentZoneId }),
  };
}
