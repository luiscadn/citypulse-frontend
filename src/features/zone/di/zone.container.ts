import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { CreateZoneUseCase } from "../application/use-cases/create-zone.use-case";
import { DeleteZoneUseCase } from "../application/use-cases/delete-zone.use-case";
import { GetZoneUseCase } from "../application/use-cases/get-zone.use-case";
import { ListZonesUseCase } from "../application/use-cases/list-zones.use-case";
import { UpdateZoneUseCase } from "../application/use-cases/update-zone.use-case";
import { HttpZoneRepository } from "../infrastructure/repositories/http-zone-repository";

/**
 * Contenedor de Inyección de Dependencias zoneContainer (Capa de Composición / DI)
 *
 * - **¿Qué hace?**: Instancia el repositorio de infraestructura `HttpZoneRepository` inyectándole el cliente
 *   `serverHttp`, y ensambla cada uno de los casos de uso del módulo de zonas (`ListZonesUseCase`, `GetZoneUseCase`,
 *   `CreateZoneUseCase`, `UpdateZoneUseCase`, `DeleteZoneUseCase`).
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta únicamente en el servidor (`server-only`).
 *   Es importado por las Server Actions (`zone.actions.ts`), los Server Components (`ZoneList`, `ZoneDetail`),
 *   y otros bounded contexts que requieren listar zonas (ej. `events/new/page.tsx`).
 * - **¿Cuál es su importancia?**: Implementa el patrón Composition Root / Service Locator para el módulo de zonas.
 *   Permite una inicialización limpia de dependencias sin necesidad de frameworks de inyección invasivos,
 *   garantizando la reutilización de instancias y facilitando el mantenimiento arquitectónico.
 */
const zoneRepository = new HttpZoneRepository(serverHttp);

export const zoneContainer = {
  listZonesUseCase: new ListZonesUseCase(zoneRepository),
  getZoneUseCase: new GetZoneUseCase(zoneRepository),
  createZoneUseCase: new CreateZoneUseCase(zoneRepository),
  updateZoneUseCase: new UpdateZoneUseCase(zoneRepository),
  deleteZoneUseCase: new DeleteZoneUseCase(zoneRepository),
};
