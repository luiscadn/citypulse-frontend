import type { Place } from "../../domain/entities/place";
import type { PlaceDto } from "../dtos/place.dto";

/**
 * Función toPlace (Mapper DTO -> Entidad de Dominio)
 *
 * - **¿Qué hace?**: Transforma un `PlaceDto` en una entidad `Place` del dominio, preservando campos esenciales
 *   y descartando atributos no utilizados por la interfaz (como `rating` y `types`).
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada en `HttpMapsRepository` para limpiar los resultados de búsqueda.
 * - **¿Cuál es su importancia?**: Asegura que el dominio solo conozca atributos necesarios, reduciendo acoplamiento
 *   y memoria en el bundle del cliente.
 */
export function toPlace(dto: PlaceDto): Place {
  return {
    placeId: dto.placeId,
    name: dto.name,
    address: dto.address,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    googleMapsUri: dto.googleMapsUri ?? null,
  };
}
