import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { CreateZoneUseCase } from "../application/use-cases/create-zone.use-case";
import { DeleteZoneUseCase } from "../application/use-cases/delete-zone.use-case";
import { GetZoneUseCase } from "../application/use-cases/get-zone.use-case";
import { ListZonesUseCase } from "../application/use-cases/list-zones.use-case";
import { UpdateZoneUseCase } from "../application/use-cases/update-zone.use-case";
import { HttpZoneRepository } from "../infrastructure/repositories/http-zone-repository";

/**
 * Arma los casos de uso de zonas con sus implementaciones concretas.
 * listZonesUseCase también sirve a otros módulos (eventos, lugares) para el selector de zona.
 */
const zoneRepository = new HttpZoneRepository(serverHttp);

export const zoneContainer = {
  listZonesUseCase: new ListZonesUseCase(zoneRepository),
  getZoneUseCase: new GetZoneUseCase(zoneRepository),
  createZoneUseCase: new CreateZoneUseCase(zoneRepository),
  updateZoneUseCase: new UpdateZoneUseCase(zoneRepository),
  deleteZoneUseCase: new DeleteZoneUseCase(zoneRepository),
};
