import type { Place } from "../../domain/entities/place";
import type { PlaceDto } from "../dtos/place.dto";

/** rating y types no los usa la UI: no se copian. */
export function toPlace(dto: PlaceDto): Place {
  return {
    placeId: dto.placeId,
    name: dto.name,
    address: dto.address,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    googleMapsUri: dto.googleMapsUri ?? null,
  };
}
