import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { AddEvidenceUseCase } from "../application/use-cases/add-evidence.use-case";
import { CancelEventUseCase } from "../application/use-cases/cancel-event.use-case";
import { ConfirmReportUseCase } from "../application/use-cases/confirm-report.use-case";
import { GetEventUseCase } from "../application/use-cases/get-event.use-case";
import { ListEventsUseCase } from "../application/use-cases/list-events.use-case";
import { ListPendingReportsUseCase } from "../application/use-cases/list-pending-reports.use-case";
import { PublishOfficialEventUseCase } from "../application/use-cases/publish-official-event.use-case";
import { RejectReportUseCase } from "../application/use-cases/reject-report.use-case";
import { ReportEventUseCase } from "../application/use-cases/report-event.use-case";
import { UpdateEventUseCase } from "../application/use-cases/update-event.use-case";
import { HttpEventRepository } from "../infrastructure/repositories/http-event-repository";

/**
 * Instancia del repositorio de eventos inyectada con el cliente HTTP seguro del servidor.
 */
const eventRepository = new HttpEventRepository(serverHttp);

/**
 * Contenedor de dependencias exportado para el módulo de Eventos.
 *
 * - **¿Qué hace?**:
 *   Expone instancias únicas de los casos de uso (`listEventsUseCase`, `getEventUseCase`,
 *   `reportEventUseCase`, `updateEventUseCase`, `cancelEventUseCase`) configuradas con `HttpEventRepository`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Composición / DI. Es consumido por Server Components (`EventList`, `EventDetail`)
 *   y Server Actions (`event.actions.ts`).
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura Inversión de Control (IoC) y desacoplamiento limpio entre la UI y los adaptadores de infraestructura.
 */
export const eventContainer = {
  listEventsUseCase: new ListEventsUseCase(eventRepository),
  getEventUseCase: new GetEventUseCase(eventRepository),
  reportEventUseCase: new ReportEventUseCase(eventRepository),
  updateEventUseCase: new UpdateEventUseCase(eventRepository),
  cancelEventUseCase: new CancelEventUseCase(eventRepository),
  publishOfficialEventUseCase: new PublishOfficialEventUseCase(eventRepository),
  addEvidenceUseCase: new AddEvidenceUseCase(eventRepository),
  listPendingReportsUseCase: new ListPendingReportsUseCase(eventRepository),
  confirmReportUseCase: new ConfirmReportUseCase(eventRepository),
  rejectReportUseCase: new RejectReportUseCase(eventRepository),
};
