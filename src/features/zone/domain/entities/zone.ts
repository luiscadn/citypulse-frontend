import { isDateString, isNonBlank, isPositiveInt } from "@/shared/domain/invariants";
import { InvalidZoneError, ZoneSelfParentError } from "../errors/zone-errors";

/** Zona de la ciudad (barrio, comuna...). Los lugares y los eventos pertenecen a una. */
export interface Zone {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  /** Zona que la contiene. null si es una zona raíz o si el backend no la envía. */
  readonly parentId: number | null;
  /** Fecha ISO de creación. */
  readonly createdAt: string;
}

/** Datos ya validados para crear o editar una zona. */
export interface ZoneInput {
  readonly name: string;
  readonly description: string | null;
  readonly parentZoneId: number | null;
}

/** Lo que llega del formulario, antes de validarlo. */
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
