import type { Zone, ZoneDraft } from "../../domain/entities/zone";
import { normalizeZoneInput } from "../../domain/rules/zone-input";
import type { ZoneRepository } from "../repositories/zone-repository";

/**
 * Caso de Uso: CreateZoneUseCase
 *
 * - **¿Qué hace?**: Orquesta la creación de una nueva zona territorial en el sistema. Recibe los datos preliminares (`ZoneDraft`),
 *   los normaliza y valida con `normalizeZoneInput`, y delega su persistencia al puerto `ZoneRepository`.
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Se instancia en `zone.container.ts`
 *   y es ejecutado desde la Server Action `createZoneAction` cuando un usuario con rol `ADMIN` envía el formulario de creación.
 * - **¿Cuál es su importancia?**: Centraliza la lógica de negocio para la adición de zonas, asegurando que ninguna zona sea
 *   enviada al backend sin haber superado previamente las reglas de validación del dominio.
 */
export class CreateZoneUseCase {
  constructor(private readonly zoneRepository: ZoneRepository) {}

  /**
   * Ejecuta la creación de una nueva zona.
   *
   * @param draft - Datos capturados en el formulario (nombre, descripción opcional, parentZoneId opcional).
   * @returns La entidad `Zone` creada y confirmada por el repositorio.
   */
  async execute(draft: ZoneDraft): Promise<Zone> {
    return this.zoneRepository.create(normalizeZoneInput(draft));
  }
}
