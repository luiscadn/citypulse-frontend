import type { MappedVenue, Venue, VenueFilters, VenueInput, VenuePage } from "../../domain/entities/venue";

/**
 * Contrato de repositorio para el manejo de Lugares.
 *
 * - **¿Qué hace?**:
 *   Declara los métodos requeridos para listar lugares públicos paginados, listar lugares propios
 *   del usuario autenticado, buscar un lugar por ID, crearlo, actualizarlo, eliminarlo y verificarlo administrativamente.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el puerto implementado por `HttpVenueRepository` en la capa de Infraestructura y consumido
 *   por los diferentes casos de uso del módulo (`CreateVenueUseCase`, `ListVenuesUseCase`, etc.).
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el Principio de Inversión de Dependencias (DIP) de SOLID. La lógica de negocio depende
 *   de abstracciones y no de implementaciones concretas, facilitando el mocking en pruebas unitarias y el desacoplamiento técnico.
 */
export interface VenueRepository {
  /** Obtiene un listado paginado y filtrado de lugares públicos. */
  list(filters: VenueFilters): Promise<VenuePage>;
  /** Obtiene todos los lugares creados por el OWNER autenticado, incluyendo los pendientes de verificación. */
  listMine(): Promise<Venue[]>;
  /** Lugares verificados con ubicación, para el mapa de la ciudad. */
  listMapped(): Promise<MappedVenue[]>;
  /** Obtiene los datos detallados de un lugar a partir de su ID. */
  findById(id: number): Promise<Venue>;
  /** Registra un nuevo lugar en el sistema asociado al usuario de la sesión. */
  create(input: VenueInput): Promise<Venue>;
  /** Actualiza la información de un lugar existente. */
  update(id: number, input: VenueInput): Promise<Venue>;
  /** Elimina un lugar del catálogo. */
  remove(id: number): Promise<void>;
  /** Certifica y verifica administrativamente un lugar previamente pendiente. */
  verify(id: number): Promise<Venue>;
}
