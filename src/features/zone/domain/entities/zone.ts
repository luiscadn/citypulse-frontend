import { isDateString, isNonBlank, isPositiveInt } from "@/shared/domain/invariants";
import { InvalidZoneError, ZoneSelfParentError } from "../errors/zone-errors";

/**
 * Entidad de Dominio Zone
 *
 * - **¿Qué hace?**: Modela una división territorial de la ciudad (comuna, barrio, corregimiento o sector).
 *   Posee un identificador único numérico (`id`), nombre (`name`), descripción opcional (`description`),
 *   el identificador opcional de su zona jerárquica contenedora (`parentId`) y su fecha ISO de registro (`createdAt`).
 * - **¿Cómo interactúa con el sistema en general?**: Es la entidad principal del bounded context de Zonas.
 *   Los lugares (`Venue`) y eventos (`Event`) mantienen referencias obligatorias a una `Zone`.
 *   Se transforma desde `ZoneDto` mediante el mapper `toZone`.
 * - **¿Cuál es su importancia?**: Proporciona el modelo inmutable (`readonly`) que encapsula la identidad y estructura
 *   de las zonas geográficas en el dominio, asegurando consistencia en toda la aplicación.
 */
export interface Zone {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  /** Zona que la contiene. null si es una zona raíz o si el backend no la envía. */
  readonly parentId: number | null;
  /** Fecha ISO de creación. */
  readonly createdAt: string;
}

/**
 * Value Object / Contrato ZoneInput
 *
 * - **¿Qué hace?**: Estructura inmutable con los datos estrictamente validados y saneados necesarios para crear o actualizar una zona:
 *   nombre normalizado sin espacios redundantes (`name`), descripción depurada (`description`) y ID de zona padre validado (`parentZoneId`).
 * - **¿Cómo interactúa con el sistema en general?**: Es producido por la regla de validación de dominio `normalizeZoneInput`
 *   y requerido por los métodos `create` y `update` de la interfaz `ZoneRepository`.
 * - **¿Cuál es su importancia?**: Asegura que la capa de infraestructura y el backend solo reciban datos que cumplen
 *   con todos los invariantes de negocio del sistema, evitando peticiones con datos incompletos o malformados.
 */
export interface ZoneInput {
  readonly name: string;
  readonly description: string | null;
  readonly parentZoneId: number | null;
}

/**
 * Tipo ZoneDraft: Borrador de entrada previo a la validación de dominio.
 *
 * - **¿Qué hace?**: Representa la estructura preliminar de datos proveniente de un formulario web o Server Action antes de ser sanitizada.
 * - **¿Cómo interactúa con el sistema en general?**: Es el argumento de entrada que reciben los casos de uso (`CreateZoneUseCase`, `UpdateZoneUseCase`)
 *   y que se somete a `normalizeZoneInput`.
 * - **¿Cuál es su importancia?**: Desacopla la forma cruda en que la UI recolecta datos del contrato estricto `ZoneInput` que exige el dominio.
 */
export interface ZoneDraft {
  name: string;
  description?: string | null;
  parentZoneId?: number | null;
}

/**
 * Única forma de construir una Zone: comprueba sus invariantes y la congela,
 * así no existe una zona en estado inválido. Es una función y no una clase
 * porque las entidades viajan de Server a Client Components, que solo admiten
 * objetos planos.
 */
export function createZone(props: Zone): Zone {
  if (!isPositiveInt(props.id)) throw new InvalidZoneError("La zona necesita un ID válido");
  if (!isNonBlank(props.name)) throw new InvalidZoneError("La zona necesita un nombre");
  if (props.parentId !== null) {
    if (!isPositiveInt(props.parentId)) throw new InvalidZoneError("La zona padre no es válida");
    if (props.parentId === props.id) throw new ZoneSelfParentError();
  }
  if (!isDateString(props.createdAt)) throw new InvalidZoneError("La fecha de creación de la zona no es válida");
  return Object.freeze({ ...props });
}
