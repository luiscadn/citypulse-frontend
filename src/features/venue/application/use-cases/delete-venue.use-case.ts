import { assertValidVenueId } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/** Borra un lugar (su OWNER o un ADMIN). Sus eventos se conservan, sin lugar. */
export class DeleteVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(id: number): Promise<void> {
    assertValidVenueId(id);
    await this.venueRepository.remove(id);
  }
}
