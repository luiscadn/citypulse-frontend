/**
 * @file event.ts
 * @description Entidades de Dominio y tipos de datos para la gestión y cartelera de Eventos.
 * Modela eventos oficiales y reportes comunitarios ciudadanos, sus estados de moderación,
 * evidencias adjuntas, fechas y metadatos de asistencia.
 */

import type { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";

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
  /** Fechas en formato ISO 8601 (UTC). */
  readonly startDate: string;
  readonly endDate: string;
  readonly zone: EventZone;
  readonly venue: EventVenue | null;
  /** Dirección en texto libre cuando el evento no se realiza en un venue registrado. */
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

/**
 * Tipos de evidencia permitidos que pueden respaldar un reporte comunitario de evento.
 */
export type EvidenceType = "FOTO" | "ENLACE" | "DOCUMENTO";

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
