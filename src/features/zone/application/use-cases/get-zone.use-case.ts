import type { Zone } from "../../domain/entities/zone";
import { ZoneNotFoundError } from "../../domain/errors/zone-errors";
import { isValidZoneId } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/**
 * Caso de Uso: GetZoneUseCase
 *
 * - **¿Qué hace?**: Recupera una zona individual según su identificador numérico.
 *   Si el ID no es estructuralmente válido, lanza `ZoneNotFoundError` de inmediato sin consultar la red.
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en `ZoneDetail` para renderizar la vista de detalle
 *   de `/zones/[id]`.
 * - **¿Cuál es su importancia?**: Implementa una política defensiva de resolución de entidades: garantiza que identificadores
 *   corruptos o malformados se traduzcan de inmediato en un estado de recurso no encontrado (404).
 */
export class GetZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  /**
   * Ejecuta la consulta de la zona por ID.
   *
   * @param id - Identificador único de la zona.
   * @returns La entidad `Zone` solicitada.
   */
  async execute(id: number): Promise<Zone> {
    if (!isValidZoneId(id)) throw new ZoneNotFoundError();
    return this.zoneRepository.findById(id);
  }
}
