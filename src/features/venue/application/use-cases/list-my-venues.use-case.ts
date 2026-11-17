import type { Venue } from "../../domain/entities/venue";
import type { VenueRepository } from "../repositories/venue-repository";

/**
 * Lugares del OWNER de la sesión. También lo usa eventos (parte 1)
 * para el selector de lugar de un evento oficial.
 */
export class ListMyVenuesUseCase {
  constructor(private readonly venueRepository: VenueRepository) {}

  execute(): Promise<Venue[]> {
    return this.venueRepository.listMine();
  }
}
