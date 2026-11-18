/**
 * @file event-repository.ts
 * @description Puerto secundario (interfaz) para el repositorio de Eventos.
 * En Arquitectura Hexagonal / Clean Architecture, define las operaciones de persistencia y consulta
 * que la capa de aplicación necesita para la gestión integral de eventos y reportes ciudadanos.
 */

import type { Event, EventDetail, EventFilters, EventInput, EventPage } from "../../domain/entities/event";

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
}
