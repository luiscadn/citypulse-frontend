/**
 * @file event.container.ts
 * @description Contenedor de Inyección de Dependencias (DI) para el módulo de Eventos.
 * Conecta el repositorio HTTP en el servidor con los casos de uso respectivos.
 */

import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { CancelEventUseCase } from "../application/use-cases/cancel-event.use-case";
import { GetEventUseCase } from "../application/use-cases/get-event.use-case";
import { ListEventsUseCase } from "../application/use-cases/list-events.use-case";
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
};
