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

/**
 * Adaptador HttpZoneRepository (Infraestructura en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Implementa el puerto `ZoneRepository` realizando llamadas HTTP reales contra los endpoints
 *   del backend (`/zone`, `/zone/:id`) a través de la abstracción `HttpClient`. Traduce códigos de error HTTP
 *   (404, 409) a errores fuertemente tipados del dominio (`ZoneNotFoundError`, `ZoneNameTakenError`, `ZoneInUseError`).
 * - **¿Cómo interactúa con el sistema en general?**: Se instancia en `zone.container.ts` recibiendo el cliente `serverHttp`.
 *   Utiliza los mappers `toZone`, `toCreateZoneBody` y `toUpdateZoneBody` para transformar datos entre la red y el dominio.
 * - **¿Cuál es su importancia?**: Encapsula todos los detalles de transporte de red y mapeo de excepciones HTTP.
 *   Si la URL de la API o la convención de endpoints cambia en el backend, solo se modifica esta clase sin afectar
 *   los casos de uso ni la interfaz de usuario.
 */
export class HttpZoneRepository implements ZoneRepository {
  constructor(private readonly http: HttpClient) {}

  /** Lista todas las zonas invocando `GET /zone`. */
  async list(): Promise<Zone[]> {
    const dtos = await this.http.get<ZoneDto[]>("/zone");
    return dtos.map(toZone);
  }

  /** Consulta una zona por su ID mediante `GET /zone/:id`. Mapea 404 a `ZoneNotFoundError`. */
  async findById(id: number): Promise<Zone> {
    try {
      return toZone(await this.http.get<ZoneDto>(`/zone/${id}`));
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) throw new ZoneNotFoundError();
      throw error;
    }
  }

  /** Crea una nueva zona mediante `POST /zone`. Mapea 404 a `ZoneParentNotFoundError` y 409 a `ZoneNameTakenError`. */
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

  /** Modifica una zona mediante `PATCH /zone/:id`. Mapea 404 y 409 a sus respectivos errores de dominio. */
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

  /** Elimina una zona mediante `DELETE /zone/:id`. Mapea 409 a `ZoneInUseError` si tiene eventos o lugares vinculados. */
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
