import { assertValidZoneId } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/** Borra una zona (solo ADMIN). El backend la rechaza si tiene lugares o eventos. */
export class DeleteZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  async execute(id: number): Promise<void> {
    assertValidZoneId(id);
    await this.zoneRepository.remove(id);
  }
}
