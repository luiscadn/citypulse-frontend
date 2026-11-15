import type { Venue, VenueDraft } from "../../domain/entities/venue";
import { normalizeVenueInput } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/** Registra un lugar del OWNER de la sesión. Nace sin verificar (RF-2.3). */
export class CreateVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(draft: VenueDraft): Promise<Venue> {
    return this.venueRepository.create(normalizeVenueInput(draft));
  }
}
