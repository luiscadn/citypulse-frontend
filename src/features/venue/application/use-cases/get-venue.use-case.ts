import type { Venue } from "../../domain/entities/venue";
import { VenueNotFoundError } from "../../domain/errors/venue-errors";
import { isValidVenueId } from "../../domain/rules/venue-input";
import type { VenueRepository } from "../repositories/venue-repository";

/** Trae un lugar por su ID. Un ID que no puede existir se trata como lugar inexistente. */
export class GetVenueUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  async execute(id: number): Promise<Venue> {
    if (!isValidVenueId(id)) throw new VenueNotFoundError();
    return this.venueRepository.findById(id);
  }
}
