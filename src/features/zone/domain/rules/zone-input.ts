import type { ZoneDraft, ZoneInput } from "../entities/zone";
import {
  InvalidZoneError,
  ZoneDescriptionTooLongError,
  ZoneNameRequiredError,
  ZoneNameTooLongError,
  ZoneSelfParentError,
} from "../errors/zone-errors";
import { ZONE_DESCRIPTION_MAX_LENGTH, ZONE_NAME_MAX_LENGTH } from "./zone-limits";

export function isValidZoneId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

/** Lanza si el ID no puede ser el de una zona: evita pedirle al backend algo que no existe. */
export function assertValidZoneId(id: number): void {
  if (!isValidZoneId(id)) throw new InvalidZoneError();
}

/**
 * Réplica UX de las validaciones del backend: limpia el formulario y rechaza lo que
 * ya se sabe que va a fallar. Si difieren, el backend gana.
 *
 * @param zoneId ID de la zona que se edita, para impedir que sea su propia zona padre.
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
