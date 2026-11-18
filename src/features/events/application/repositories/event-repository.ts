import type {
  Event,
  EventDetail,
  EventFilters,
  EventInput,
  EventPage,
  EvidenceInput,
  OfficialEventInput,
  PendingReport,
} from "../../domain/entities/event";

/**
 * Contrato de repositorio para el manejo de Eventos.
 *
 * - **¿Qué hace?**:
 *   Declara los métodos para listar eventos paginados y filtrados, obtener el detalle exhaustivo por UUID,
 *   reportar un nuevo evento comunitario, actualizar un reporte existente y cancelar un evento.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Implementado por `HttpEventRepository` en la capa de Infraestructura y consumido por los casos de uso
 *   (`ListEventsUseCase`, `GetEventUseCase`, `ReportEventUseCase`, `UpdateEventUseCase`, `CancelEventUseCase`).
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el Principio de Inversión de Dependencias (DIP) de SOLID. Mantiene la lógica del negocio
 *   independiente de la tecnología HTTP, clientes REST o esquemas externos de base de datos.
 */
export interface EventRepository {
  /** Obtiene una página filtrada de eventos públicos o accesibles para el usuario en sesión. */
  list(filters: EventFilters): Promise<EventPage>;
  /** Obtiene la información detallada de un evento por su UUID, incluyendo evidencias y conteo de asistentes. */
  findById(id: string): Promise<EventDetail>;
  /** Registra un reporte ciudadano a nombre del usuario en sesión, naciendo con estado REPORTADO. */
  report(input: EventInput): Promise<Event>;
  /** Modifica los datos de un evento existente. */
  update(id: string, input: EventInput): Promise<Event>;
  /** Cancela un evento previamente publicado o reportado. */
  cancel(id: string): Promise<void>;
  /** Evento oficial en un lugar del usuario de la sesión. Nace CONFIRMADO. */
  publishOfficial(input: OfficialEventInput): Promise<Event>;
  addEvidence(eventId: string, input: EvidenceInput): Promise<void>;
  /** Cola de moderación: reportes en revisión que ya tienen evidencias (solo ADMIN). */
  listPendingReports(): Promise<readonly PendingReport[]>;
  confirmReport(id: string): Promise<void>;
  rejectReport(id: string, reason: string): Promise<void>;
}
