import type { ZoneDraft, ZoneInput } from "../entities/zone";
import {
  InvalidZoneError,
  ZoneDescriptionTooLongError,
  ZoneNameRequiredError,
  ZoneNameTooLongError,
  ZoneSelfParentError,
} from "../errors/zone-errors";
import { ZONE_DESCRIPTION_MAX_LENGTH, ZONE_NAME_MAX_LENGTH } from "./zone-limits";

/**
 * Función isValidZoneId
 *
 * - **¿Qué hace?**: Verifica si un valor numérico es un entero estrictamente positivo (`> 0`).
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada por `assertValidZoneId` y validaciones de `parentZoneId`.
 * - **¿Cuál es su importancia?**: Previene consultas con identificadores negativos, nulos o flotantes.
 */
export function isValidZoneId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/**
 * Función assertValidZoneId
 *
 * - **¿Qué hace?**: Valida que el identificador sea admisible mediante `isValidZoneId`; si no lo es, arroja `InvalidZoneError`.
 * - **¿Cómo interactúa con el sistema en general?**: Llamada al inicio de los casos de uso (`DeleteZoneUseCase`, `UpdateZoneUseCase`).
 * - **¿Cuál es su importancia?**: Asegura el principio "fail-fast", abortando la ejecución antes de interactuar con el repositorio.
 */
export function assertValidZoneId(id: number): void {
  if (!isValidZoneId(id)) throw new InvalidZoneError();
}

/**
 * Función normalizeZoneInput: Validación y saneamiento de datos para zonas.
 *
 * - **¿Qué hace?**: Toma un borrador `ZoneDraft`, elimina espacios en blanco de los extremos (`trim`),
 *   comprueba que el nombre exista y no supere el límite, valida la longitud de la descripción opcional,
 *   y asegura que `parentZoneId` sea un ID válido y diferente del ID de la propia zona que se está editando (`zoneId`).
 * - **¿Cómo interactúa con el sistema en general?**: Es el punto de paso obligado entre los datos del formulario
 *   y los casos de uso de creación y actualización (`CreateZoneUseCase`, `UpdateZoneUseCase`).
 * - **¿Cuál es su importancia?**: Garantiza la integridad de los datos de entrada antes de generar tráfico hacia el backend,
 *   evitando estados inconsistentes y arrojando errores específicos de dominio listos para ser presentados al usuario.
 */
export function normalizeZoneInput(draft: ZoneDraft, zoneId?: number): ZoneInput {
  const name = draft.name.trim();
  if (!name) throw new ZoneNameRequiredError();
  if (name.length > ZONE_NAME_MAX_LENGTH) throw new ZoneNameTooLongError();

  const description = draft.description?.trim() || null;
  if (description && description.length > ZONE_DESCRIPTION_MAX_LENGTH) {
    throw new ZoneDescriptionTooLongError();
  }

  const parentZoneId = draft.parentZoneId ?? null;
  if (parentZoneId !== null) {
    if (!isValidZoneId(parentZoneId)) throw new InvalidZoneError("La zona padre no es válida");
    if (parentZoneId === zoneId) throw new ZoneSelfParentError();
  }

  return { name, description, parentZoneId };
}
