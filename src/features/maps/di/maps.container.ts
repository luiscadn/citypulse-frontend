import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { SearchPlacesUseCase } from "../application/use-cases/search-places.use-case";
import { HttpMapsRepository } from "../infrastructure/repositories/http-maps-repository";

/** Arma los casos de uso de mapas con sus implementaciones concretas. */
const mapsRepository = new HttpMapsRepository(serverHttp);

export const mapsContainer = {
  searchPlacesUseCase: new SearchPlacesUseCase(mapsRepository),
};
