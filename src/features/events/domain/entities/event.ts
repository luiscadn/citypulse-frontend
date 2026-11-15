import type { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";

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

export type EvidenceType = "FOTO" | "ENLACE" | "DOCUMENTO";

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
