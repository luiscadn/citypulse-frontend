import { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import { isOneOf } from "@/shared/domain/invariants";
import {
  EVIDENCE_TYPES,
  type EventDraft,
  type EventFilters,
  type EventInput,
  type EvidenceDraft,
  type EvidenceInput,
  type OfficialEventDraft,
  type OfficialEventInput,
} from "../entities/event";
import {
  EventAddressTooLongError,
  EventDatesOrderError,
  EventEndDateRequiredError,
  EventStartDateRequiredError,
  EventTitleRequiredError,
  EventTitleTooLongError,
  EventCapacityError,
  EventTicketPriceError,
  EventVisibilityError,
  EventZoneRequiredError,
  EvidenceCaptionTooLongError,
  EvidenceTypeError,
  EvidenceUrlError,
  InvalidEventError,
  OfficialVenueRequiredError,
  RejectionReasonRequiredError,
  RejectionReasonTooLongError,
} from "../errors/event-errors";
import {
  EVENT_ADDRESS_MAX_LENGTH,
  EVENT_SEARCH_MAX_LENGTH,
  EVENT_TITLE_MAX_LENGTH,
  EVIDENCE_CAPTION_MAX_LENGTH,
  EVIDENCE_URL_MAX_LENGTH,
  REJECTION_REASON_MAX_LENGTH,
} from "./event-limits";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Colombia no tiene horario de verano: el desfase con UTC es siempre el mismo. */
const COLOMBIA_OFFSET_HOURS = 5;
const DATETIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidEventId(id: string): boolean {
  return UUID.test(id);
}

/** Lanza si el ID no puede ser el de un evento: evita pedirle al backend algo que no existe. */
export function assertValidEventId(id: string): void {
  if (!isValidEventId(id)) throw new InvalidEventError();
}

/**
 * Pasa lo que entrega <input type="datetime-local"> ("2026-10-01T09:00", hora de Colombia)
 * a una fecha ISO en UTC. Devuelve null si no es una fecha válida.
 */
export function colombiaLocalToIso(value: string): string | null {
  if (!DATETIME_LOCAL.test(value)) return null;
  const date = new Date(`${value}:00-0${COLOMBIA_OFFSET_HOURS}:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Lo contrario: una fecha ISO a "2026-10-01T09:00" en hora de Colombia, para llenar el formulario. */
export function isoToColombiaLocal(isoDate: string): string {
  const shifted = new Date(new Date(isoDate).getTime() - COLOMBIA_OFFSET_HOURS * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

/**
 * Réplica UX de CreateReportDto y de la regla "fin posterior al inicio": limpia el formulario
 * y rechaza lo que ya se sabe que va a fallar. Si difieren, el backend gana.
 */
export function normalizeEventInput(draft: EventDraft): EventInput {
  const title = draft.title.trim();
  if (!title) throw new EventTitleRequiredError();
  if (title.length > EVENT_TITLE_MAX_LENGTH) throw new EventTitleTooLongError();

  if (!isPositiveInteger(draft.zoneId)) throw new EventZoneRequiredError();

  const addressText = draft.addressText?.trim() || null;
  if (addressText && addressText.length > EVENT_ADDRESS_MAX_LENGTH) throw new EventAddressTooLongError();

  if (!draft.startDate.trim()) throw new EventStartDateRequiredError();
  const startDate = colombiaLocalToIso(draft.startDate.trim());
  if (!startDate) throw new EventStartDateRequiredError("La fecha de inicio no es válida");

  if (!draft.endDate.trim()) throw new EventEndDateRequiredError();
  const endDate = colombiaLocalToIso(draft.endDate.trim());
  if (!endDate) throw new EventEndDateRequiredError("La fecha de fin no es válida");

  if (new Date(endDate) <= new Date(startDate)) throw new EventDatesOrderError();

  return {
    title,
    description: draft.description?.trim() || null,
    zoneId: draft.zoneId,
    addressText,
    startDate,
    endDate,
  };
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** "2026-12-01" solo si es un día que existe (descarta "2026-02-31"); si no, null. */
function parseDay(raw: string | undefined): string | null {
  if (!raw || !DAY.test(raw)) return null;
  const date = new Date(`${raw}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(raw) ? raw : null;
}

/** Primer instante de un día de Colombia, en ISO (UTC), para el filtro "desde". */
export function colombiaDayStartIso(day: string): string {
  return new Date(`${day}T00:00:00-0${COLOMBIA_OFFSET_HOURS}:00`).toISOString();
}

/** Último instante de un día de Colombia, en ISO (UTC), para el filtro "hasta". */
export function colombiaDayEndIso(day: string): string {
  return new Date(`${day}T23:59:59.999-0${COLOMBIA_OFFSET_HOURS}:00`).toISOString();
}

function enumValue<T extends string>(values: Record<string, T>, raw: string | undefined): T | null {
  return Object.values(values).find((value) => value === raw) ?? null;
}

/**
 * Filtros a partir de lo que venga en la URL. Lo que no tenga sentido se ignora
 * (se muestra todo) en vez de fallar: la URL la puede escribir cualquiera.
 */
export function parseEventFilters(raw: {
  zoneId?: string;
  status?: string;
  origin?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: string;
}): EventFilters {
  const zoneId = Number(raw.zoneId);
  const page = Number(raw.page);
  const search = raw.search?.trim().slice(0, EVENT_SEARCH_MAX_LENGTH);
  return {
    zoneId: isPositiveInteger(zoneId) ? zoneId : null,
    status: enumValue(EventStatus, raw.status),
    origin: enumValue(EventOrigin, raw.origin),
    search: search || null,
    from: parseDay(raw.from),
    to: parseDay(raw.to),
    page: isPositiveInteger(page) ? page : 1,
  };
}

/** Solo direcciones web (http o https): descarta javascript:, data: y similares. */
export function isWebUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Réplica UX de CreateEvidenceDto: tipo conocido, enlace web y descripción corta. */
export function normalizeEvidenceInput(draft: EvidenceDraft): EvidenceInput {
  if (!isOneOf(EVIDENCE_TYPES, draft.type)) throw new EvidenceTypeError();
  const url = draft.url.trim();
  if (!isWebUrl(url) || url.length > EVIDENCE_URL_MAX_LENGTH) throw new EvidenceUrlError();
  const caption = draft.caption?.trim() || null;
  if (caption && caption.length > EVIDENCE_CAPTION_MAX_LENGTH) throw new EvidenceCaptionTooLongError();
  return { type: draft.type, url, caption };
}

/** Réplica UX de RejectEventDto: el motivo es obligatorio. */
export function normalizeRejectionReason(reason: string): string {
  const clean = reason.trim();
  if (!clean) throw new RejectionReasonRequiredError();
  if (clean.length > REJECTION_REASON_MAX_LENGTH) throw new RejectionReasonTooLongError();
  return clean;
}

const PRICE = /^\d+(\.\d{1,2})?$/;

/** Réplica UX de CreateOfficialDto: lo mismo que un reporte, más lugar, visibilidad, cupo y precio. */
export function normalizeOfficialEventInput(draft: OfficialEventDraft): OfficialEventInput {
  if (!isPositiveInteger(draft.venueId)) throw new OfficialVenueRequiredError();
  const base = normalizeEventInput(draft);
  if (!isOneOf(Object.values(EventVisibility), draft.visibility)) throw new EventVisibilityError();

  const capacity = draft.capacity ?? null;
  if (capacity !== null && !isPositiveInteger(capacity)) throw new EventCapacityError();

  const ticketPrice = draft.ticketPrice ?? null;
  if (ticketPrice !== null && (!Number.isFinite(ticketPrice) || !PRICE.test(String(ticketPrice)))) {
    throw new EventTicketPriceError();
  }

  return { ...base, venueId: draft.venueId, visibility: draft.visibility, capacity, ticketPrice };
}
