import type { Venue, VenueInput, VenuePage } from "../../domain/entities/venue";
import type { VenueBodyDto, VenueDto, VenuePageDto } from "../dtos/venue.dto";

/** Solo copia lo que usa la UI: del dueño, nunca más que id, usuario y nombre. */
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

export function toVenuePage(dto: VenuePageDto): VenuePage {
  return {
    venues: dto.data.map(toVenue),
    total: dto.total,
    page: dto.page,
    // Sin resultados el backend responde lastPage 0: siempre hay al menos una página
    lastPage: Math.max(dto.lastPage, 1),
  };
}

/** Al registrar, la descripción vacía no se envía. */
export function toCreateVenueBody(input: VenueInput): VenueBodyDto {
  return {
    name: input.name,
    address: input.address,
    zoneId: input.zoneId,
    ...(input.description && { description: input.description }),
  };
}

/** Al editar, la descripción va siempre: null la borra. */
export function toUpdateVenueBody(input: VenueInput): VenueBodyDto {
  return {
    name: input.name,
    address: input.address,
    zoneId: input.zoneId,
    description: input.description,
  };
}
