import type { Zone, ZoneDraft } from "../../domain/entities/zone";
import { assertValidZoneId, normalizeZoneInput } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/**
 * Caso de Uso: UpdateZoneUseCase
 *
 * - **¿Qué hace?**: Actualiza los datos de una zona existente. Valida el ID de la zona con `assertValidZoneId`,
 *   normaliza el borrador asegurando que no se asigne la zona como su propio padre (`normalizeZoneInput(draft, id)`),
 *   y delega la modificación al repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde la Server Action `updateZoneAction`
 *   cuando un administrador guarda cambios en `ZoneForm`.
 * - **¿Cuál es su importancia?**: Protege la integridad de las jerarquías territoriales evitando la formación de bucles
 *   o referencias circulares antes de impactar el backend.
 */
export class UpdateZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  /**
   * Ejecuta la actualización de la zona.
   *
   * @param id - Identificador de la zona a modificar.
   * @param draft - Nuevos valores preliminares enviados por el formulario.
   * @returns La entidad `Zone` modificada.
   */
  async execute(id: number, draft: ZoneDraft): Promise<Zone> {
    assertValidZoneId(id);
    return this.zoneRepository.update(id, normalizeZoneInput(draft, id));
  }
}
