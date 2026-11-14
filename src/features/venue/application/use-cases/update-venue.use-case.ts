import type { Venue, VenueDraft } from "../../domain/entities/venue";
import { assertValidVenueId, normalizeVenueInput } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/** Edita un lugar (su OWNER o un ADMIN). El backend decide si pierde la verificación. */
export class UpdateVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(id: number, draft: VenueDraft): Promise<Venue> {
    assertValidVenueId(id);
    return this.venueRepository.update(id, normalizeVenueInput(draft));
  }
}
