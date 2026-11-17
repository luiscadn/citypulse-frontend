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
 * Arma los casos de uso de lugares con sus implementaciones concretas.
 * listMyVenuesUseCase también sirve a eventos (parte 1) para elegir el lugar de un evento oficial.
 */
const venueRepository = new HttpVenueRepository(serverHttp);

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
