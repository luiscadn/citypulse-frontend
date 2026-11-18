import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { SearchPlacesUseCase } from "../application/use-cases/search-places.use-case";
import { HttpMapsRepository } from "../infrastructure/repositories/http-maps-repository";

/**
 * Contenedor de Inyección de Dependencias mapsContainer (Capa de Composición / DI)
 *
 * - **¿Qué hace?**: Crea la instancia de `HttpMapsRepository` asociada a `serverHttp` y expone el caso de uso
 *   `searchPlacesUseCase`.
 * - **¿Cómo interactúa con el sistema en general?**: Corre exclusivamente en el servidor (`server-only`).
 *   Es importado por la Server Action `searchPlacesAction`.
 * - **¿Cuál es su importancia?**: Centraliza la composición de objetos de mapas, desacoplando la instanciación
 *   de las Server Actions y facilitando el mantenimiento.
 */
const mapsRepository = new HttpMapsRepository(serverHttp);

export const mapsContainer = {
  searchPlacesUseCase: new SearchPlacesUseCase(mapsRepository),
};
