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

/** Expresión regular para validar formato UUID v4 canónico. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Desfase horario fijo de Colombia respecto a UTC (UTC-5, sin horario de verano). */
const COLOMBIA_OFFSET_HOURS = 5;
/** Expresión regular para el formato de entrada de `<input type="datetime-local">` (YYYY-MM-DDTHH:mm). */
const DATETIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** Función auxiliar para verificar enteros positivos. */
function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Valida si un identificador de evento es un UUID válido.
 *
 * - **¿Qué hace?**: Evalúa el string contra el patrón canónico de UUID.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `GetEventUseCase` y Server Actions.
 * - **¿Cuál es su importancia?**: Evita peticiones HTTP erróneas ante parámetros maliciosos o corruptos.
 */
export function isValidEventId(id: string): boolean {
  return UUID.test(id);
}

/**
 * Aserción que lanza `InvalidEventError` si el ID no es un UUID válido.
 */
export function assertValidEventId(id: string): void {
  if (!isValidEventId(id)) throw new InvalidEventError();
}

/**
 * Convierte una fecha y hora local de Colombia ("YYYY-MM-DDTHH:mm") a formato ISO 8601 en UTC.
 *
 * - **¿Qué hace?**: Parsea el string local agregando el desfase `-05:00` y genera la cadena ISO en tiempo universal coordinado.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `normalizeEventInput` al procesar los formularios.
 * - **¿Cuál es su importancia?**: Garantiza que el backend siempre almacene fechas normalizadas en UTC, sin importar el huso horario del navegador.
 */
export function colombiaLocalToIso(value: string): string | null {
  if (!DATETIME_LOCAL.test(value)) return null;
  const date = new Date(`${value}:00-0${COLOMBIA_OFFSET_HOURS}:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Convierte una fecha ISO (UTC) a la representación local colombiana ("YYYY-MM-DDTHH:mm") para rellenar inputs HTML.
 *
 * - **¿Qué hace?**: Resta 5 horas al instante UTC y toma los primeros 16 caracteres.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `EventForm` cuando está en modo edición para poblar `defaultValue`.
 * - **¿Cuál es su importancia?**: Proporciona al usuario colombiano la fecha en su hora local esperada.
 */
export function isoToColombiaLocal(isoDate: string): string {
  const shifted = new Date(new Date(isoDate).getTime() - COLOMBIA_OFFSET_HOURS * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

/**
 * Normaliza y valida el borrador de un evento (`EventDraft`) produciendo un `EventInput` seguro.
 *
 * - **¿Qué hace?**:
 *   Aplica `trim()`, comprueba obligatoriedad y límites de longitud de título y dirección,
 *   valida el ID de zona, transforma las fechas locales a UTC y verifica que la fecha de finalización sea estrictamente posterior a la de inicio.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Punto de validación central en `ReportEventUseCase` y `UpdateEventUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza la validez semántica y cronológica de los eventos antes de cualquier comunicación con el backend.
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

/**
 * Parsea un día en formato "YYYY-MM-DD" validando que represente un día real del calendario (descarta días imposibles como 31 de febrero).
 */
function parseDay(raw: string | undefined): string | null {
  if (!raw || !DAY.test(raw)) return null;
  const date = new Date(`${raw}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(raw) ? raw : null;
}

/**
 * Obtiene el primer instante (00:00:00) de un día en Colombia expresado en ISO UTC.
 *
 * - **¿Qué hace?**: Calcula el inicio del día local con desfase `-05:00` y lo serializa a UTC.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.list` para el parámetro de filtro `from`.
 * - **¿Cuál es su importancia?**: Asegura que el filtro de fechas capture todos los eventos que ocurren a partir de la medianoche local.
 */
export function colombiaDayStartIso(day: string): string {
  return new Date(`${day}T00:00:00-0${COLOMBIA_OFFSET_HOURS}:00`).toISOString();
}

/**
 * Obtiene el último instante (23:59:59.999) de un día en Colombia expresado en ISO UTC.
 *
 * - **¿Qué hace?**: Calcula el final del día local con desfase `-05:00` y lo serializa a UTC.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.list` para el parámetro de filtro `to`.
 * - **¿Cuál es su importancia?**: Asegura que el filtro cubra el día completo hasta el último milisegundo en hora local colombiana.
 */
export function colombiaDayEndIso(day: string): string {
  return new Date(`${day}T23:59:59.999-0${COLOMBIA_OFFSET_HOURS}:00`).toISOString();
}

/**
 * Helper genérico para validar si un string crudo pertenece a los valores de un enum.
 */
function enumValue<T extends string>(values: Record<string, T>, raw: string | undefined): T | null {
  return Object.values(values).find((value) => value === raw) ?? null;
}

/**
 * Extrae y sanea los filtros de búsqueda a partir de los query parameters de la URL.
 *
 * - **¿Qué hace?**:
 *   Parsea y normaliza `zoneId`, `status`, `origin`, `search`, `from`, `to` y `page`.
 *   Los valores incongruentes se reemplazan con `null` o valores predeterminados sin lanzar excepciones.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocado por el Server Component `EventList` para procesar `searchParams`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que cualquier URL escrita a mano o compartida no rompa la aplicación, proporcionando tolerancia a fallos.
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
