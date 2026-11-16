import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { CancelEventUseCase } from "../application/use-cases/cancel-event.use-case";
import { GetEventUseCase } from "../application/use-cases/get-event.use-case";
import { ListEventsUseCase } from "../application/use-cases/list-events.use-case";
import { ReportEventUseCase } from "../application/use-cases/report-event.use-case";
import { UpdateEventUseCase } from "../application/use-cases/update-event.use-case";
import { HttpEventRepository } from "../infrastructure/repositories/http-event-repository";

/**
 * Arma los casos de uso de eventos con sus implementaciones concretas.
 * Los datos para elegir la zona vienen de zoneContainer.listZonesUseCase.
 */
const eventRepository = new HttpEventRepository(serverHttp);

export const eventContainer = {
  listEventsUseCase: new ListEventsUseCase(eventRepository),
  getEventUseCase: new GetEventUseCase(eventRepository),
  reportEventUseCase: new ReportEventUseCase(eventRepository),
  updateEventUseCase: new UpdateEventUseCase(eventRepository),
  cancelEventUseCase: new CancelEventUseCase(eventRepository),
};
