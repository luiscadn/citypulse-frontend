import { EventOrigin, EventStatus } from "@/shared/domain/enums";
import type { EventDraft, EventFilters, EventInput } from "../entities/event";
import {
  EventAddressTooLongError,
  EventDatesOrderError,
  EventEndDateRequiredError,
  EventStartDateRequiredError,
  EventTitleRequiredError,
  EventTitleTooLongError,
  EventZoneRequiredError,
  InvalidEventError,
} from "../errors/event-errors";
import { EVENT_ADDRESS_MAX_LENGTH, EVENT_SEARCH_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH } from "./event-limits";

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
    page: isPositiveInteger(page) ? page : 1,
  };
}
