import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { ZoneRepository } from "../../application/repositories/zone-repository";
import type { Zone, ZoneInput } from "../../domain/entities/zone";
import {
  ZoneInUseError,
  ZoneNameTakenError,
  ZoneNotFoundError,
  ZoneParentNotFoundError,
} from "../../domain/errors/zone-errors";
import type { ZoneDto } from "../dtos/zone.dto";
import { toCreateZoneBody, toUpdateZoneBody, toZone } from "../mappers/zone.mapper";

export class HttpZoneRepository implements ZoneRepository {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<Zone[]> {
    const dtos = await this.http.get<ZoneDto[]>("/zone");
    return dtos.map(toZone);
  }

  async findById(id: number): Promise<Zone> {
    try {
      return toZone(await this.http.get<ZoneDto>(`/zone/${id}`));
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) throw new ZoneNotFoundError();
      throw error;
    }
  }

  async create(input: ZoneInput): Promise<Zone> {
    try {
      return toZone(await this.http.post<ZoneDto>("/zone", toCreateZoneBody(input)));
    } catch (error) {
      if (error instanceof HttpError) {
        // Al crear, el único 404 posible es el de la zona padre
        if (error.status === 404) throw new ZoneParentNotFoundError();
        if (error.status === 409) throw new ZoneNameTakenError();
      }
      throw error;
    }
  }

  async update(id: number, input: ZoneInput): Promise<Zone> {
    try {
      return toZone(await this.http.patch<ZoneDto>(`/zone/${id}`, toUpdateZoneBody(input)));
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 404) throw new ZoneNotFoundError("Esta zona o su zona padre ya no existe");
        if (error.status === 409) throw new ZoneNameTakenError();
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.http.delete(`/zone/${id}`);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 404) throw new ZoneNotFoundError();
        if (error.status === 409) throw new ZoneInUseError();
      }
      throw error;
    }
  }
}
