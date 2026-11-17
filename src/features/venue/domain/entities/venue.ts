import { isDateString, isNonBlank, isPositiveInt } from "@/shared/domain/invariants";
import { InvalidVenueError } from "../errors/venue-errors";

/** Lugar (teatro, museo, parque...) que registra un OWNER y verifica un ADMIN. */
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
  /** Fecha ISO de creación. */
  readonly createdAt: string;
}

export interface VenueZone {
  readonly id: number;
  readonly name: string;
}

/** Dueño del lugar. Sin correo ni datos internos de la cuenta. */
export interface VenueOwner {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/** Filtros del listado público. null = sin filtrar. */
export interface VenueFilters {
  readonly zoneId: number | null;
  readonly isVerified: boolean | null;
  readonly page: number;
}

/** Una página del listado. */
export interface VenuePage {
  readonly venues: readonly Venue[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;
}

/** Datos ya validados para registrar o editar un lugar. */
export interface VenueInput {
  readonly name: string;
  readonly address: string;
  readonly description: string | null;
  readonly zoneId: number;
  readonly latitude: number | null;
  readonly longitude: number | null;
}

/** Lo que llega del formulario, antes de validarlo. */
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
