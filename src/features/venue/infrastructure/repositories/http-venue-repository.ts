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

/**
 * Comprueba si un error capturado corresponde a un `HttpError` con un código de estado HTTP específico.
 */
function isStatus(error: unknown, status: number): boolean {
  return error instanceof HttpError && error.status === status;
}

/**
 * Implementación HTTP de `VenueRepository` conectada a los endpoints de `/venues` del backend NestJS.
 *
 * - **¿Qué hace?**:
 *   Maneja las llamadas de red para listados paginados, listados propios, consulta por ID,
 *   creación, edición, borrado y verificación de lugares, mapeando los resultados y transformando
 *   errores HTTP (403, 404, 409) en excepciones de dominio.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Es instanciado en `venue.container.ts` pasando la instancia
 *   compartida `serverHttp` e inyectado en todos los casos de uso del módulo de venues.
 *
 * - **¿Cuál es su importancia?**:
 *   Aísla por completo los detalles de transporte, serialización y endpoints REST, permitiendo que
 *   la capa de aplicación y el dominio permanezcan agnósticos a la red.
 */
export class HttpVenueRepository implements VenueRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Consulta el listado público paginado de lugares.
   *
   * - **¿Qué hace?**: Serializa los filtros de zona, verificación y página en query parameters y efectúa `GET /venues`.
   * - **¿Cómo interactúa con el sistema en general?**: Mapea la respuesta con `toVenuePage` y la entrega a `ListVenuesUseCase`.
   * - **¿Cuál es su importancia?**: Proporciona el soporte de datos para la pantalla principal de exploración de venues.
   */
  async list(filters: VenueFilters): Promise<VenuePage> {
    const params = new URLSearchParams({ page: String(filters.page), limit: String(VENUES_PAGE_SIZE) });
    if (filters.zoneId !== null) params.set("zoneId", String(filters.zoneId));
    if (filters.isVerified !== null) params.set("isVerified", String(filters.isVerified));
    return toVenuePage(await this.http.get<VenuePageDto>(`/venues?${params}`));
  }

  /**
   * Consulta los lugares gestionados por el usuario autenticado.
   *
   * - **¿Qué hace?**: Efectúa una petición `GET /venues/mine`.
   * - **¿Cómo interactúa con el sistema en general?**: Mapea la lista resultante con `toVenue` y la retorna a `ListMyVenuesUseCase`.
   * - **¿Cuál es su importancia?**: Permite al OWNER ver sus establecimientos incluso si están en estado pendiente.
   */
  async listMine(): Promise<Venue[]> {
    const dtos = await this.http.get<VenueDto[]>("/venues/mine");
    return dtos.map(toVenue);
  }

  async listMapped(): Promise<MappedVenue[]> {
    const params = new URLSearchParams({ page: "1", limit: String(MAP_VENUES_LIMIT), isVerified: "true" });
    const page = toVenuePage(await this.http.get<VenuePageDto>(`/venues?${params}`));
    return page.venues.filter(hasLocation);
  }

  /**
   * Busca un lugar por su identificador.
   *
   * - **¿Qué hace?**: Ejecuta `GET /venues/:id` y atrapa 404 para lanzar `VenueNotFoundError`.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna la entidad de dominio `Venue` a `GetVenueUseCase`.
   * - **¿Cuál es su importancia?**: Provee los datos para la página de detalle `/venues/[id]`.
   */
  async findById(id: number): Promise<Venue> {
    try {
      return toVenue(await this.http.get<VenueDto>(`/venues/${id}`));
    } catch (error) {
      if (isStatus(error, 404)) throw new VenueNotFoundError();
      throw error;
    }
  }

  /**
   * Registra un nuevo lugar.
   *
   * - **¿Qué hace?**: Realiza `POST /venues` con el cuerpo formateado por `toCreateVenueBody`. Traduce 404 a `VenueZoneNotFoundError` y 409 a `VenueNameTakenError`.
   * - **¿Cómo interactúa con el sistema en general?**: Devuelve el nuevo venue creado a `CreateVenueUseCase`.
   * - **¿Cuál es su importancia?**: Encapsula el alta de locales con control semántico de errores de colisión y relaciones inexistentes.
   */
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

  /**
   * Actualiza un lugar existente.
   *
   * - **¿Qué hace?**: Envía `PATCH /venues/:id` con `toUpdateVenueBody`. Mapea 403 a `VenueForbiddenError`, 404 a `VenueNotFoundError` y 409 a `VenueNameTakenError`.
   * - **¿Cómo interactúa con el sistema en general?**: Retorna el venue actualizado a `UpdateVenueUseCase`.
   * - **¿Cuál es su importancia?**: Permite modificar información de locales con gestión precisa de autorizaciones y conflictos.
   */
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

  /**
   * Elimina un lugar por ID.
   *
   * - **¿Qué hace?**: Ejecuta `DELETE /venues/:id`. Traduce 403 a `VenueForbiddenError` y 404 a `VenueNotFoundError`.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `DeleteVenueUseCase`.
   * - **¿Cuál es su importancia?**: Gestiona la eliminación física en el backend protegiendo contra accesos no autorizados.
   */
  async remove(id: number): Promise<void> {
    try {
      await this.http.delete(`/venues/${id}`);
    } catch (error) {
      if (isStatus(error, 403)) throw new VenueForbiddenError();
      if (isStatus(error, 404)) throw new VenueNotFoundError();
      throw error;
    }
  }

  /**
   * Marca un lugar como verificado administrativamente.
   *
   * - **¿Qué hace?**: Ejecuta `PATCH /venues/:id/verify`. Traduce 404 a `VenueNotFoundError`.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `VerifyVenueUseCase`.
   * - **¿Cuál es su importancia?**: Permite al administrador sellar la autenticidad y validez del venue.
   */
  async verify(id: number): Promise<Venue> {
    try {
      return toVenue(await this.http.patch<VenueDto>(`/venues/${id}/verify`, {}));
    } catch (error) {
      if (isStatus(error, 404)) throw new VenueNotFoundError();
      throw error;
    }
  }
}
