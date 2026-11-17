import { createZone, type Zone, type ZoneInput } from "../../domain/entities/zone";
import type { ZoneBodyDto, ZoneDto } from "../dtos/zone.dto";

export function toZone(dto: ZoneDto): Zone {
  return createZone({
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    parentId: dto.parent?.id ?? null,
    createdAt: dto.createdAt,
  });
}

/** Al crear, lo vacío no se envía: el backend lo deja en null por defecto. */
export function toCreateZoneBody(input: ZoneInput): ZoneBodyDto {
  return {
    name: input.name,
    ...(input.description && { description: input.description }),
    ...(input.parentZoneId && { parentZoneId: input.parentZoneId }),
  };
}

/**
 * Al editar, la descripción va siempre: null la borra.
 * parentZoneId solo va si se eligió una; el backend no acepta null ahí
 * (intentaría buscar la zona null), así que sin elegir se deja la actual.
 */
export function toUpdateZoneBody(input: ZoneInput): ZoneBodyDto {
  return {
    name: input.name,
    description: input.description,
    ...(input.parentZoneId && { parentZoneId: input.parentZoneId }),
  };
}
