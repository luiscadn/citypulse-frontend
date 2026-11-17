import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { VenueRepository } from "../../application/repositories/venue-repository";
import { hasLocation, type MappedVenue, type Venue, type VenueFilters, type VenueInput, type VenuePage } from "../../domain/entities/venue";
import {
  VenueForbiddenError,
  VenueNameTakenError,
  VenueNotFoundError,
  VenueZoneNotFoundError,
} from "../../domain/errors/venue-errors";
import { MAP_VENUES_LIMIT, VENUES_PAGE_SIZE } from "../../domain/rules/venue-limits";
import type { VenueDto, VenuePageDto } from "../dtos/venue.dto";
import { toCreateVenueBody, toUpdateVenueBody, toVenue, toVenuePage } from "../mappers/venue.mapper";

function isStatus(error: unknown, status: number): boolean {
  return error instanceof HttpError && error.status === status;
}

export class HttpVenueRepository implements VenueRepository {
  constructor(private readonly http: HttpClient) {}

  async list(filters: VenueFilters): Promise<VenuePage> {
    const params = new URLSearchParams({ page: String(filters.page), limit: String(VENUES_PAGE_SIZE) });
    if (filters.zoneId !== null) params.set("zoneId", String(filters.zoneId));
    if (filters.isVerified !== null) params.set("isVerified", String(filters.isVerified));
    return toVenuePage(await this.http.get<VenuePageDto>(`/venues?${params}`));
  }

  async listMine(): Promise<Venue[]> {
    const dtos = await this.http.get<VenueDto[]>("/venues/mine");
    return dtos.map(toVenue);
  }

  async listMapped(): Promise<MappedVenue[]> {
    const params = new URLSearchParams({ page: "1", limit: String(MAP_VENUES_LIMIT), isVerified: "true" });
    const page = toVenuePage(await this.http.get<VenuePageDto>(`/venues?${params}`));
    return page.venues.filter(hasLocation);
  }

  async findById(id: number): Promise<Venue> {
    try {
      return toVenue(await this.http.get<VenueDto>(`/venues/${id}`));
    } catch (error) {
      if (isStatus(error, 404)) throw new VenueNotFoundError();
      throw error;
    }
  }

  async create(input: VenueInput): Promise<Venue> {
    try {
      return toVenue(await this.http.post<VenueDto>("/venues", toCreateVenueBody(input)));
    } catch (error) {
      // Al registrar, el único 404 posible es el de la zona
      if (isStatus(error, 404)) throw new VenueZoneNotFoundError();
      if (isStatus(error, 409)) throw new VenueNameTakenError();
      throw error;
    }
  }

  async update(id: number, input: VenueInput): Promise<Venue> {
    try {
      return toVenue(await this.http.patch<VenueDto>(`/venues/${id}`, toUpdateVenueBody(input)));
    } catch (error) {
      if (isStatus(error, 403)) throw new VenueForbiddenError();
      if (isStatus(error, 404)) throw new VenueNotFoundError("Este lugar o la zona elegida ya no existe");
      if (isStatus(error, 409)) throw new VenueNameTakenError();
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.http.delete(`/venues/${id}`);
    } catch (error) {
      if (isStatus(error, 403)) throw new VenueForbiddenError();
      if (isStatus(error, 404)) throw new VenueNotFoundError();
      throw error;
    }
  }

  async verify(id: number): Promise<Venue> {
    try {
      return toVenue(await this.http.patch<VenueDto>(`/venues/${id}/verify`, {}));
    } catch (error) {
      if (isStatus(error, 404)) throw new VenueNotFoundError();
      throw error;
    }
  }
}
