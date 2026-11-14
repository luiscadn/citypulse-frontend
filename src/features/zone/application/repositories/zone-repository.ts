import type { Zone, ZoneInput } from "../../domain/entities/zone";

/** Puerto: lo que la aplicación necesita del backend para manejar zonas. */
export interface ZoneRepository {
  list(): Promise<Zone[]>;
  findById(id: number): Promise<Zone>;
  create(input: ZoneInput): Promise<Zone>;
  update(id: number, input: ZoneInput): Promise<Zone>;
  remove(id: number): Promise<void>;
}
