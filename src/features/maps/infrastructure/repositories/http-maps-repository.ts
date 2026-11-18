import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { MapsRepository } from "../../application/repositories/maps-repository";
import type { Place } from "../../domain/entities/place";
import { MapsUnavailableError, MapsUpstreamError } from "../../domain/errors/maps-errors";
import type { PlaceDto } from "../dtos/place.dto";
import { toPlace } from "../mappers/place.mapper";

/**
 * Adaptador HttpMapsRepository (Infraestructura en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Implementa el puerto `MapsRepository` realizando una petición `GET /maps/search` a través
 *   de `HttpClient`. Captura excepciones HTTP 503 y las mapea a `MapsUnavailableError`, y códigos 502/504 a `MapsUpstreamError`.
 * - **¿Cómo interactúa con el sistema en general?**: Se instancia en `maps.container.ts` y sirve como el canal
 *   de comunicación con el backend para la integración con Google Maps.
 * - **¿Cuál es su importancia?**: Centraliza la comunicación de red para geocodificación y mapea fallos de red externos
 *   a excepciones de dominio explicativas para el usuario.
 */
export class HttpMapsRepository implements MapsRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Ejecuta la consulta remota de lugares hacia `/maps/search`.
   *
   * @param query - Término de búsqueda normalizado.
   * @param limit - Cantidad máxima de resultados solicitados.
   * @returns Lista de entidades `Place` adaptadas.
   */
  async searchPlaces(query: string, limit: number): Promise<Place[]> {
    const params = new URLSearchParams({ query, limit: String(limit) });
    try {
      const dtos = await this.http.get<PlaceDto[]>(`/maps/search?${params}`);
      return dtos.map(toPlace);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 503) throw new MapsUnavailableError();
        if (error.status === 502 || error.status === 504) throw new MapsUpstreamError();
      }
      throw error;
    }
  }
}
