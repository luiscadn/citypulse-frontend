import { isValidLocation, type VenueDraft, type VenueFilters, type VenueInput } from "../entities/venue";
import {
  InvalidVenueError,
  VenueAddressRequiredError,
  VenueAddressTooLongError,
  VenueDescriptionTooLongError,
  VenueLocationError,
  VenueNameRequiredError,
  VenueNameTooLongError,
  VenueZoneRequiredError,
} from "../errors/venue-errors";
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_DESCRIPTION_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from "./venue-limits";

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidVenueId(id: number): boolean {
  return isPositiveInteger(id);
}

/** Lanza si el ID no puede ser el de un lugar: evita pedirle al backend algo que no existe. */
export function assertValidVenueId(id: number): void {
  if (!isValidVenueId(id)) throw new InvalidVenueError();
}

// Campo vacío (NaN, null o undefined) = sin ubicación
function toCoordinate(value: number | null | undefined): number | null {
  return value === null || value === undefined || Number.isNaN(value) ? null : value;
}

/**
 * Réplica UX de CreateVenueDto: limpia el formulario y rechaza lo que ya se sabe
 * que va a fallar. Si difieren, el backend gana.
 */
export function normalizeVenueInput(draft: VenueDraft): VenueInput {
  const name = draft.name.trim();
  if (!name) throw new VenueNameRequiredError();
  if (name.length > VENUE_NAME_MAX_LENGTH) throw new VenueNameTooLongError();

  const address = draft.address.trim();
  if (!address) throw new VenueAddressRequiredError();
  if (address.length > VENUE_ADDRESS_MAX_LENGTH) throw new VenueAddressTooLongError();

  const description = draft.description?.trim() || null;
  if (description && description.length > VENUE_DESCRIPTION_MAX_LENGTH) {
    throw new VenueDescriptionTooLongError();
  }

  if (!isPositiveInteger(draft.zoneId)) throw new VenueZoneRequiredError();

  const latitude = toCoordinate(draft.latitude);
  const longitude = toCoordinate(draft.longitude);
  if (!isValidLocation(latitude, longitude)) throw new VenueLocationError();

  return { name, address, description, zoneId: draft.zoneId, latitude, longitude };
}

/**
 * Filtros a partir de lo que venga en la URL. Lo que no tenga sentido se ignora
 * (se muestra todo) en vez de fallar: la URL la puede escribir cualquiera.
 */
export function parseVenueFilters(raw: {
  zoneId?: string;
  isVerified?: string;
  page?: string;
}): VenueFilters {
  const zoneId = Number(raw.zoneId);
  const page = Number(raw.page);
  return {
    zoneId: isPositiveInteger(zoneId) ? zoneId : null,
    isVerified: raw.isVerified === "true" ? true : raw.isVerified === "false" ? false : null,
    page: isPositiveInteger(page) ? page : 1,
  };
}
