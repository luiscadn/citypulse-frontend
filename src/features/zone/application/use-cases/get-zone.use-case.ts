import type { Zone } from "../../domain/entities/zone";
import { ZoneNotFoundError } from "../../domain/errors/zone-errors";
import { isValidZoneId } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/** Trae una zona por su ID. Un ID que no puede existir se trata como zona inexistente. */
export class GetZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(id: number): Promise<Zone> {
    if (!isValidZoneId(id)) throw new ZoneNotFoundError();
    return this.zoneRepository.findById(id);
  }
}
