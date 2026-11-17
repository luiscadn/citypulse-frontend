import type { MappedVenue } from "../../domain/entities/venue";
import type { VenueRepository } from "../repositories/venue-repository";

/** Lugares verificados que tienen ubicación: los puntos del mapa de la ciudad. */
export class ListMappedVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  execute(): Promise<MappedVenue[]> {
    return this.venueRepository.listMapped();
  }
}
