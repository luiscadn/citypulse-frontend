/**
 * @file venue.container.ts
 * @description Contenedor de Inyección de Dependencias (DI) para el módulo de Lugares (Venues).
 * Configura e instancia el repositorio HTTP del lado del servidor y todos los casos de uso correspondientes.
 */

import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { CreateVenueUseCase } from "../application/use-cases/create-venue.use-case";
import { DeleteVenueUseCase } from "../application/use-cases/delete-venue.use-case";
import { GetVenueUseCase } from "../application/use-cases/get-venue.use-case";
import { ListMappedVenuesUseCase } from "../application/use-cases/list-mapped-venues.use-case";
import { ListMyVenuesUseCase } from "../application/use-cases/list-my-venues.use-case";
import { ListVenuesUseCase } from "../application/use-cases/list-venues.use-case";
import { UpdateVenueUseCase } from "../application/use-cases/update-venue.use-case";
import { VerifyVenueUseCase } from "../application/use-cases/verify-venue.use-case";
import { HttpVenueRepository } from "../infrastructure/repositories/http-venue-repository";

/**
 * Instancia única del repositorio HTTP configurada con el cliente HTTP del servidor (`serverHttp`).
 */
const venueRepository = new HttpVenueRepository(serverHttp);

/**
 * Contenedor de dependencias exportado para el módulo de Venues.
 *
 * - **¿Qué hace?**:
 *   Empaqueta todas las instancias de los casos de uso del módulo (`listVenuesUseCase`, `listMyVenuesUseCase`,
 *   `getVenueUseCase`, `createVenueUseCase`, `updateVenueUseCase`, `deleteVenueUseCase`, `verifyVenueUseCase`),
 *   inyectándoles el repositorio concreto `HttpVenueRepository`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Composición / DI. Es consumido por Server Components (`VenueList`, `VenueDetail`, `MyVenues`),
 *   Server Actions (`venue.actions.ts`) e incluso por otros módulos (por ejemplo, `events` usa `listMyVenuesUseCase`).
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza la resolución de dependencias (IoC), garantizando que los componentes de presentación
 *   no instancien clases de infraestructura directamente y facilitando la modularidad y el testing.
 */
export const venueContainer = {
  listVenuesUseCase: new ListVenuesUseCase(venueRepository),
  listMyVenuesUseCase: new ListMyVenuesUseCase(venueRepository),
  listMappedVenuesUseCase: new ListMappedVenuesUseCase(venueRepository),
  getVenueUseCase: new GetVenueUseCase(venueRepository),
  createVenueUseCase: new CreateVenueUseCase(venueRepository),
  updateVenueUseCase: new UpdateVenueUseCase(venueRepository),
  deleteVenueUseCase: new DeleteVenueUseCase(venueRepository),
  verifyVenueUseCase: new VerifyVenueUseCase(venueRepository),
};
