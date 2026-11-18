import { assertValidZoneId } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/**
 * Caso de Uso: DeleteZoneUseCase
 *
 * - **¿Qué hace?**: Gestiona la eliminación de una zona urbana a partir de su ID numérico.
 *   Valida que el identificador sea admisible mediante `assertValidZoneId` y solicita la baja al repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Se invoca desde `deleteZoneAction`. Si la zona tiene lugares o eventos
 *   asociados, el repositorio capturará la respuesta de conflicto del backend y lanzará `ZoneInUseError`.
 * - **¿Cuál es su importancia?**: Encapsula el flujo de eliminación de zonas, protegiendo la integridad del sistema
 *   y asegurando validaciones previas antes de intentar la eliminación en la base de datos.
 */
export class DeleteZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  /**
   * Ejecuta la eliminación de la zona.
   *
   * @param id - Identificador numérico de la zona a suprimir.
   */
  async execute(id: number): Promise<void> {
    assertValidZoneId(id);
    await this.zoneRepository.remove(id);
  }
}
