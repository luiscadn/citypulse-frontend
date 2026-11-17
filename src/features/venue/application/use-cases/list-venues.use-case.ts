import type { VenueFilters, VenuePage } from "../../domain/entities/venue";
import type { VenueRepository } from "../repositories/venue-repository";

/** Listado público de lugares, filtrado por zona o por verificación y paginado. */
export class ListVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  execute(filters: VenueFilters): Promise<VenuePage> {
    return this.venueRepository.list(filters);
  }
}
