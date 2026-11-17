import type { Venue } from "../../domain/entities/venue";
import { assertValidVenueId } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/** Marca un lugar como verificado (solo ADMIN, RF-2.4). */
export class VerifyVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(id: number): Promise<Venue> {
    assertValidVenueId(id);
    return this.venueRepository.verify(id);
  }
}
