import type { Zone } from "../../domain/entities/zone";
import type { ZoneRepository } from "../repositories/zone-repository";

/** Trae todas las zonas, ordenadas por nombre para mostrarlas en listas y selectores. */
export class ListZonesUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(): Promise<Zone[]> {
    const zones = await this.zoneRepository.list();
    return [...zones].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }
}
