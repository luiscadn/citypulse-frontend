import { isDateString, isNonBlank, isPositiveInt } from "@/shared/domain/invariants";
import { InvalidVenueError } from "../errors/venue-errors";

/**
 * Entidad principal de Dominio que modela un Lugar (Venue).
 *
 * - **¿Qué hace?**:
 *   Define los atributos esenciales e inmutables de un lugar físico: identificador,
 *   nombre, descripción, dirección física, estado de verificación oficial, zona geográfica
 *   a la que pertenece, información del propietario y marca de tiempo ISO de creación.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el núcleo del submódulo de venues en la capa de Dominio. Es consumida por casos de uso
 *   (`GetVenueUseCase`, `ListVenuesUseCase`, etc.), mapeada desde DTOs en la capa de Infraestructura
 *   y renderizada en componentes de la capa de Presentación (`VenueDetail`, `VenueRow`).
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza el modelo conceptual de espacios físicos del sistema. Al usar `readonly`, asegura
 *   la inmutabilidad de la entidad evitando efectos secundarios accidentales durante el flujo de datos.
 */
export interface Venue {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly address: string | null;
  /** Ubicación en el mapa: las dos o ninguna. */
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly isVerified: boolean;
  readonly zone: VenueZone;
  readonly owner: VenueOwner;
  /** Fecha ISO de creación en el servidor. */
  readonly createdAt: string;
}

/**
 * Objeto de valor / Sub-entidad simplificada que representa la Zona asociada a un Lugar.
 *
 * - **¿Qué hace?**:
 *   Contiene la información mínima necesaria de la zona (comuna o corregimiento) donde se ubica el lugar.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Permite vincular el lugar con el módulo geográfico (`Zone`) sin acoplar toda la estructura pesada
 *   de zonas al detalle del venue.
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el principio de segregación de interfaces y minimiza la transferencia innecesaria de datos.
 */
export interface VenueZone {
  readonly id: number;
  readonly name: string;
}

/**
 * Objeto de valor que representa al Dueño (OWNER) de un Lugar.
 *
 * - **¿Qué hace?**:
 *   Expone de manera segura los datos públicos del propietario del lugar: id, username y nombre completo.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Se asocia a la entidad `Venue` para determinar permisos de edición/eliminación mediante reglas
 *   de negocio (`canManageVenue`).
 *
 * - **¿Cuál es su importancia?**:
 *   Seguridad y privacidad: excluye intencionalmente correos electrónicos, contraseñas o roles internos,
 *   evitando fugas de datos sensibles hacia las vistas públicas.
 */
export interface VenueOwner {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/**
 * Criterios de filtrado y paginación para el listado de Lugares.
 *
 * - **¿Qué hace?**:
 *   Estructura los parámetros opcionales de búsqueda: zona específica (`zoneId`), estado de verificación
 *   (`isVerified`) y número de página solicitada.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es construido por `parseVenueFilters` a partir de los query params de la URL y consumido por
 *   `ListVenuesUseCase` y `HttpVenueRepository` para construir las peticiones HTTP correspondientes.
 *
 * - **¿Cuál es su importancia?**:
 *   Evita strings mágicos o parámetros desordenados, tipando estrictamente los filtros de navegación
 *   y búsqueda del catálogo de venues.
 */
export interface VenueFilters {
  readonly zoneId: number | null;
  readonly isVerified: boolean | null;
  readonly page: number;
}

/**
 * Representa una página de resultados de Lugares retornada por el repositorio.
 *
 * - **¿Qué hace?**:
 *   Agrupa la lista inmutable de lugares obtenidos junto con los metadatos de paginación:
 *   total de registros, página actual y última página disponible.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Retornado por `VenueRepository.list` hacia el caso de uso y consumido por componentes
 *   como `VenueList` y `VenuePagination` para renderizar el catálogo y los controles de avance.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite paginar eficientemente grandes volúmenes de datos, evitando sobrecargar la memoria
 *   del cliente y optimizando el tiempo de respuesta.
 */
export interface VenuePage {
  readonly venues: readonly Venue[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;
}

/**
 * Datos limpios, normalizados y validados para registrar o actualizar un Lugar.
 *
 * - **¿Qué hace?**:
 *   Define la estructura formal que garantiza que los datos cumplen con las reglas de negocio
 *   (longitudes máximas, campos requeridos y zona válida) antes de llamar al backend.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el resultado devuelto por la función de dominio `normalizeVenueInput` y es el parámetro
 *   exigido por los métodos `create` y `update` de `VenueRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza la integridad semántica y estructural de los datos ("Parse, don't validate"),
 *   impidiendo que datos corruptos alcancen los repositorios de infraestructura.
 */
export interface VenueInput {
  readonly name: string;
  readonly address: string;
  readonly description: string | null;
  readonly zoneId: number;
  readonly latitude: number | null;
  readonly longitude: number | null;
}

/**
 * Borrador o datos crudos provenientes directamente de un formulario de usuario.
 *
 * - **¿Qué hace?**:
 *   Modela la estructura flexible de entrada de datos antes de ser sometida a validación y saneamiento.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es recibido por las Server Actions (`createVenueAction`, `updateVenueAction`) y pasado a los
 *   casos de uso para que estos lo transformen en un `VenueInput` válido.
 *
 * - **¿Cuál es su importancia?**:
 *   Desacopla la vista y el estado de los formularios de las estrictas garantías que exige el dominio,
 *   permitiendo manejar estados transitorios e inputs incompletos.
 */
export interface VenueDraft {
  name: string;
  address: string;
  description?: string | null;
  zoneId: number;
  /** NaN o null = sin ubicación */
  latitude?: number | null;
  longitude?: number | null;
}

/** Un lugar que se puede poner en el mapa: tiene las dos coordenadas. */
export type MappedVenue = Venue & { readonly latitude: number; readonly longitude: number };

export function hasLocation(venue: Venue): venue is MappedVenue {
  return venue.latitude !== null && venue.longitude !== null;
}

/** Latitud y longitud válidas, o las dos ausentes. */
export function isValidLocation(latitude: number | null, longitude: number | null): boolean {
  if (latitude === null && longitude === null) return true;
  return (
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
}

/**
 * Única forma de construir un Venue: comprueba sus invariantes y lo congela.
 * Función y no clase: las entidades viajan a Client Components como objetos planos.
 */
export function createVenue(props: Venue): Venue {
  if (!isPositiveInt(props.id)) throw new InvalidVenueError("El lugar necesita un ID válido");
  if (!isNonBlank(props.name)) throw new InvalidVenueError("El lugar necesita un nombre");
  if (!isPositiveInt(props.zone.id) || !isNonBlank(props.zone.name)) {
    throw new InvalidVenueError("El lugar debe pertenecer a una zona válida");
  }
  if (!isPositiveInt(props.owner.id)) throw new InvalidVenueError("El lugar debe tener un dueño válido");
  if (!isDateString(props.createdAt)) throw new InvalidVenueError("La fecha de creación del lugar no es válida");
  if (!isValidLocation(props.latitude, props.longitude)) {
    throw new InvalidVenueError("La ubicación del lugar no es válida");
  }
  return Object.freeze({
    ...props,
    zone: Object.freeze({ ...props.zone }),
    owner: Object.freeze({ ...props.owner }),
  });
}
