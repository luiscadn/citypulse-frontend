import type { Zone, ZoneDraft } from "../../domain/entities/zone";
import { normalizeZoneInput } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/** Crea una zona (solo ADMIN; el backend lo exige). */
export class CreateZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(draft: ZoneDraft): Promise<Zone> {
    return this.zoneRepository.create(normalizeZoneInput(draft));
  }
}
