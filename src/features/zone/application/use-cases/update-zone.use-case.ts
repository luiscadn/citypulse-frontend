import type { Zone, ZoneDraft } from "../../domain/entities/zone";
import { assertValidZoneId, normalizeZoneInput } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/** Edita una zona (solo ADMIN). Impide que sea su propia zona padre antes de llamar al backend. */
export class UpdateZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(id: number, draft: ZoneDraft): Promise<Zone> {
    assertValidZoneId(id);
    return this.zoneRepository.update(id, normalizeZoneInput(draft, id));
  }
}
