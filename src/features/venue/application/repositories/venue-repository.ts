import type { Venue, VenueFilters, VenueInput, VenuePage } from "../../domain/entities/venue";

/** Puerto: lo que la aplicación necesita del backend para manejar lugares. */
export interface VenueRepository {
  list(filters: VenueFilters): Promise<VenuePage>;
  /** Lugares del OWNER de la sesión, incluidos los pendientes de verificar. */
  listMine(): Promise<Venue[]>;
  findById(id: number): Promise<Venue>;
  create(input: VenueInput): Promise<Venue>;
  update(id: number, input: VenueInput): Promise<Venue>;
  remove(id: number): Promise<void>;
  verify(id: number): Promise<Venue>;
}
