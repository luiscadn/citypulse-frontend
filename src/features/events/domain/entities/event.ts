import { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import { isDateString, isNonBlank, isOneOf, isPositiveInt } from "@/shared/domain/invariants";
import { EventDatesOrderError, InvalidEventError } from "../errors/event-errors";

/**
 * Entidad principal de Dominio que representa un Evento.
 *
 * - **¿Qué hace?**:
 *   Define los atributos fundamentales e inmutables de un evento cultural, deportivo o comunitario:
 *   identificador UUID, título, descripción, rango de fechas ISO (inicio y fin), zona geográfica,
 *   lugar físico registrado (`venue`) o dirección libre (`addressText`), origen (oficial o reporte ciudadano),
 *   estado de moderación (reportado, confirmado, rechazado, cancelado), visibilidad (pública o privada),
 *   capacidad máxima, precio de taquilla y datos públicos del autor/organizador.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el núcleo del módulo de eventos en la capa de Dominio. Es consumida por casos de uso
 *   (`ListEventsUseCase`, `ReportEventUseCase`), mapeada desde `EventDto` en Infraestructura y
 *   renderizada en componentes de Presentación (`EventCard`, `EventList`).
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza el modelo unificado para eventos tanto institucionales como reportados por la ciudadanía,
 *   garantizando inmutabilidad mediante `readonly` y previniendo mutaciones accidentales.
 */
export interface Event {
  /** Identificador único universal (UUID v4). */
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

/**
 * Sub-entidad que representa la Zona geográfica donde se desarrolla el Evento.
 *
 * - **¿Qué hace?**: Modela la comuna o corregimiento asociado al evento con su ID numérico y nombre.
 * - **¿Cómo interactúa con el sistema en general?**: Vincula el evento con el catálogo geográfico (`Zone`).
 * - **¿Cuál es su importancia?**: Permite filtrado territorial sin acoplar la entidad completa de zona.
 */
export interface EventZone {
  readonly id: number;
  readonly name: string;
}

/**
 * Sub-entidad simplificada que representa el Lugar físico registrado asociado al Evento.
 *
 * - **¿Qué hace?**: Almacena el ID y nombre del recinto cultural o deportivo registrado donde se aloja el evento.
 * - **¿Cómo interactúa con el sistema en general?**: Vincula el evento con el módulo de `Venue`.
 * - **¿Cuál es su importancia?**: Permite navegación cruzada hacia el detalle del recinto (`/venues/[id]`).
 */
export interface EventVenue {
  readonly id: number;
  readonly name: string;
}

/**
 * Objeto de valor que representa al Creador o Reportante del Evento.
 *
 * - **¿Qué hace?**: Expone los datos públicos de la persona que registró o reportó el evento (id, username, fullName).
 * - **¿Cómo interactúa con el sistema en general?**: Usada en comprobaciones de autoría (`isAuthorOrAdmin`) y en la vista de detalle.
 * - **¿Cuál es su importancia?**: Protege la privacidad omitiendo credenciales o correos electrónicos en respuestas públicas.
 */
export interface EventAuthor {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

export const EVIDENCE_TYPES = ["FOTO", "ENLACE", "DOCUMENTO"] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

/**
 * Entidad que modela una Evidencia adjuntada a un reporte de evento.
 *
 * - **¿Qué hace?**:
 *   Registra el tipo de prueba (`FOTO`, `ENLACE`, `DOCUMENTO`), la URL del recurso y un pie descriptivo opcional (`caption`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Forma parte de `EventDetail` y es examinada por moderadores/administradores al verificar reportes ciudadanos.
 *
 * - **¿Cuál es su importancia?**:
 *   Sustenta la veracidad de los eventos reportados por la comunidad antes de que un ADMIN los confirme.
 */
export interface EventEvidence {
  readonly id: number;
  readonly type: EvidenceType;
  readonly url: string;
  readonly caption: string | null;
}

/**
 * Extensión de la entidad `Event` con información complementaria exhibida en la vista de detalle.
 *
 * - **¿Qué hace?**:
 *   Incorpora el conteo de asistentes confirmados (`attendeeCount`), la lista de evidencias adjuntas (`evidences`)
 *   y la razón de rechazo administrativo (`rejectionReason`) en caso de haber sido declinado.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Retornada por `GetEventUseCase` y consumida por el Server Component `EventDetail`.
 *
 * - **¿Cuál es su importancia?**:
 *   Optimiza el listado público evitando transferir evidencias y conteos masivos cuando solo se requiere un resumen en tarjeta.
 */
export interface EventDetail extends Event {
  readonly attendeeCount: number;
  readonly evidences: readonly EventEvidence[];
  /** Razón justificada del rechazo si un ADMIN declinó el reporte. */
  readonly rejectionReason: string | null;
}

/**
 * Criterios de filtrado y búsqueda para la cartelera de Eventos.
 *
 * - **¿Qué hace?**:
 *   Estructura los parámetros opcionales: zona, estado de moderación, origen (oficial/reporte),
 *   texto de búsqueda libre, rango de fechas en días locales de Colombia (`from`, `to`) y paginación.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Generado por `parseEventFilters` a partir de la URL y transmitido a `ListEventsUseCase` y `HttpEventRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza el tipado seguro de los criterios de búsqueda garantizando consultas consistentes a la API.
 */
export interface EventFilters {
  readonly zoneId: number | null;
  readonly status: EventStatus | null;
  readonly origin: EventOrigin | null;
  readonly search: string | null;
  /** Día en formato "YYYY-MM-DD" (hora legal de Colombia): eventos que inician en o después de este día. */
  readonly from: string | null;
  /** Día en formato "YYYY-MM-DD" (hora legal de Colombia): eventos que inician en o antes de este día. */
  readonly to: string | null;
  readonly page: number;
}

/**
 * Página de resultados de Eventos retornada por las consultas paginadas.
 *
 * - **¿Qué hace?**: Contiene el arreglo de eventos de la página actual y metadatos de paginación (`total`, `page`, `lastPage`).
 * - **¿Cómo interactúa con el sistema en general?**: Devuelta por el caso de uso y consumida por `EventList` y `EventPagination`.
 * - **¿Cuál es su importancia?**: Permite recorrer colecciones extensas de eventos sin penalizar el rendimiento del navegador.
 */
export interface EventPage {
  readonly events: readonly Event[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;
}

/**
 * Datos validados y normalizados para reportar o editar un evento.
 *
 * - **¿Qué hace?**:
 *   Contiene los campos requeridos limpios con fechas obligatoriamente transformadas a formato ISO 8601 en UTC.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el resultado de `normalizeEventInput` y es el contrato de entrada para `report` y `update` en `EventRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura la pureza de los datos y la coherencia horaria universal (UTC) antes de interactuar con la red.
 */
export interface EventInput {
  readonly title: string;
  readonly description: string | null;
  readonly zoneId: number;
  readonly addressText: string | null;
  readonly startDate: string;
  readonly endDate: string;
}

/**
 * Borrador crudo de evento proveniente de la interfaz de usuario.
 *
 * - **¿Qué hace?**:
 *   Captura los valores de entrada de los inputs HTML, donde las fechas vienen en formato local
 *   de `<input type="datetime-local">` ("YYYY-MM-DDTHH:mm") en hora local colombiana.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Producido por las Server Actions a partir del `FormData` y enviado a los casos de uso para su validación.
 *
 * - **¿Cuál es su importancia?**:
 *   Tolera discrepancias de formatos locales facilitando una experiencia de usuario natural en formularios.
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
  return Object.freeze({ ...props, ...event, evidences: freezeEvidences(props.evidences) });
}

function freezeEvidences(evidences: readonly EventEvidence[]): readonly EventEvidence[] {
  for (const evidence of evidences) {
    if (!isPositiveInt(evidence.id) || !isNonBlank(evidence.url) || !isOneOf(EVIDENCE_TYPES, evidence.type)) {
      throw new InvalidEventError("Una evidencia del evento no es válida");
    }
  }
  return Object.freeze(evidences.map((evidence) => Object.freeze({ ...evidence })));
}

/** Reporte en la cola de moderación: está en revisión y trae sus evidencias. */
export interface PendingReport extends Event {
  readonly evidences: readonly EventEvidence[];
}

/** Igual que createEvent, más: solo un reporte en revisión puede estar en la cola. */
export function createPendingReport(props: PendingReport): PendingReport {
  const event = createEvent(props);
  if (event.status !== EventStatus.REPORTADO) {
    throw new InvalidEventError("Solo un reporte en revisión puede estar pendiente de moderación");
  }
  return Object.freeze({ ...event, evidences: freezeEvidences(props.evidences) });
}

/** Evidencia ya validada, lista para adjuntar a un reporte. */
export interface EvidenceInput {
  readonly type: EvidenceType;
  readonly url: string;
  readonly caption: string | null;
}

/** Lo que llega del formulario de evidencia, antes de validarlo. */
export interface EvidenceDraft {
  type: string;
  url: string;
  caption?: string | null;
}

/** Evento oficial ya validado: un evento en un lugar propio, con sus datos de público. */
export interface OfficialEventInput extends EventInput {
  readonly venueId: number;
  readonly visibility: EventVisibility;
  readonly capacity: number | null;
  readonly ticketPrice: number | null;
}

/** Lo que llega del formulario de evento oficial, antes de validarlo. */
export interface OfficialEventDraft extends EventDraft {
  venueId: number;
  visibility: string;
  capacity?: number | null;
  ticketPrice?: number | null;
}
