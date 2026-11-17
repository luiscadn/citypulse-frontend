import { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import { isDateString, isNonBlank, isOneOf, isPositiveInt } from "@/shared/domain/invariants";
import { EventDatesOrderError, InvalidEventError } from "../errors/event-errors";

/** Evento tal como se ve en un listado. */
export interface Event {
  /** UUID */
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  /** Fechas ISO */
  readonly startDate: string;
  readonly endDate: string;
  readonly zone: EventZone;
  readonly venue: EventVenue | null;
  /** Dirección libre cuando no hay lugar registrado */
  readonly addressText: string | null;
  readonly origin: EventOrigin;
  readonly status: EventStatus;
  readonly visibility: EventVisibility;
  readonly capacity: number | null;
  readonly ticketPrice: number | null;
  readonly createdBy: EventAuthor;
}

export interface EventZone {
  readonly id: number;
  readonly name: string;
}

export interface EventVenue {
  readonly id: number;
  readonly name: string;
}

/** Quien reportó o publicó el evento. Sin correo ni datos internos de la cuenta. */
export interface EventAuthor {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

export const EVIDENCE_TYPES = ["FOTO", "ENLACE", "DOCUMENTO"] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

/** Prueba que su autor adjunta a un reporte para que un ADMIN lo confirme. */
export interface EventEvidence {
  readonly id: number;
  readonly type: EvidenceType;
  readonly url: string;
  readonly caption: string | null;
}

/** Detalle de un evento: el listado más lo que solo se muestra al abrirlo. */
export interface EventDetail extends Event {
  readonly attendeeCount: number;
  readonly evidences: readonly EventEvidence[];
  /** Solo si un ADMIN rechazó el reporte */
  readonly rejectionReason: string | null;
}

/** Filtros del listado. null = sin filtrar. */
export interface EventFilters {
  readonly zoneId: number | null;
  readonly status: EventStatus | null;
  readonly origin: EventOrigin | null;
  readonly search: string | null;
  /** Día "2026-12-01" (hora de Colombia): eventos que empiezan ese día o después */
  readonly from: string | null;
  /** Día "2026-12-31" (hora de Colombia): eventos que empiezan ese día o antes */
  readonly to: string | null;
  readonly page: number;
}

/** Una página del listado. */
export interface EventPage {
  readonly events: readonly Event[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;
}

/** Datos ya validados para reportar o editar un evento. Las fechas van en ISO (UTC). */
export interface EventInput {
  readonly title: string;
  readonly description: string | null;
  readonly zoneId: number;
  readonly addressText: string | null;
  readonly startDate: string;
  readonly endDate: string;
}

/**
 * Lo que llega del formulario, antes de validarlo.
 * Las fechas vienen como las entrega <input type="datetime-local"> ("2026-10-01T09:00", hora de Colombia).
 */
export interface EventDraft {
  title: string;
  description?: string | null;
  zoneId: number;
  addressText?: string | null;
  startDate: string;
  endDate: string;
}

const isNullOr = <T>(value: T | null, check: (v: T) => boolean) => value === null || check(value);

/**
 * Única forma de construir un Event: comprueba sus invariantes (las mismas que
 * la base de datos) y lo congela. Función y no clase: las entidades viajan a
 * Client Components como objetos planos.
 */
export function createEvent(props: Event): Event {
  if (!isNonBlank(props.id)) throw new InvalidEventError("El evento necesita un ID");
  if (!isNonBlank(props.title)) throw new InvalidEventError("El evento necesita un título");
  if (!isDateString(props.startDate) || !isDateString(props.endDate)) {
    throw new InvalidEventError("Las fechas del evento no son válidas");
  }
  if (Date.parse(props.endDate) <= Date.parse(props.startDate)) throw new EventDatesOrderError();
  if (!isPositiveInt(props.zone.id)) throw new InvalidEventError("El evento debe pertenecer a una zona válida");
  if (!isNullOr(props.venue, (venue) => isPositiveInt(venue.id))) {
    throw new InvalidEventError("El lugar del evento no es válido");
  }
  if (!isOneOf(Object.values(EventOrigin), props.origin)) throw new InvalidEventError("El origen del evento no es válido");
  if (!isOneOf(Object.values(EventStatus), props.status)) throw new InvalidEventError("El estado del evento no es válido");
  if (!isOneOf(Object.values(EventVisibility), props.visibility)) {
    throw new InvalidEventError("La visibilidad del evento no es válida");
  }
  if (!isNullOr(props.capacity, isPositiveInt)) throw new InvalidEventError("La capacidad debe ser un entero positivo");
  if (!isNullOr(props.ticketPrice, (price) => Number.isFinite(price) && price >= 0)) {
    throw new InvalidEventError("El precio no puede ser negativo");
  }
  if (!isPositiveInt(props.createdBy.id)) throw new InvalidEventError("El evento debe tener un autor válido");
  return Object.freeze({
    ...props,
    zone: Object.freeze({ ...props.zone }),
    venue: props.venue && Object.freeze({ ...props.venue }),
    createdBy: Object.freeze({ ...props.createdBy }),
  });
}

/** Igual que createEvent, más las invariantes del detalle (asistentes y evidencias). */
export function createEventDetail(props: EventDetail): EventDetail {
  const event = createEvent(props);
  if (!Number.isInteger(props.attendeeCount) || props.attendeeCount < 0) {
    throw new InvalidEventError("El número de asistentes no es válido");
  }
  for (const evidence of props.evidences) {
    if (!isPositiveInt(evidence.id) || !isNonBlank(evidence.url) || !isOneOf(EVIDENCE_TYPES, evidence.type)) {
      throw new InvalidEventError("Una evidencia del evento no es válida");
    }
  }
  return Object.freeze({
    ...props,
    ...event,
    evidences: Object.freeze(props.evidences.map((evidence) => Object.freeze({ ...evidence }))),
  });
}
