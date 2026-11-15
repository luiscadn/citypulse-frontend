import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { MapsRepository } from "../../application/repositories/maps-repository";
import type { Place } from "../../domain/entities/place";
import { MapsUnavailableError, MapsUpstreamError } from "../../domain/errors/maps-errors";
import type { PlaceDto } from "../dtos/place.dto";
import { toPlace } from "../mappers/place.mapper";

export class HttpMapsRepository implements MapsRepository {
  constructor(private readonly http: HttpClient) {}

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
