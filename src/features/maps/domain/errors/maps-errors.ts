import { DomainError } from "@/shared/domain/errors/domain-error";
import { PLACE_QUERY_MIN_LENGTH } from "../rules/place-query-limits";

export class PlaceQueryTooShortError extends DomainError {
  constructor(message = `Escribe al menos ${PLACE_QUERY_MIN_LENGTH} letras para buscar`) {
    super(message);
  }
}

/** El backend no tiene GOOGLE_MAPS_API_KEY (503): el formulario se puede llenar igual a mano. */
export class MapsUnavailableError extends DomainError {
  constructor(message = "El buscador de Google Maps no está disponible. Llena los datos a mano.") {
    super(message);
  }
}

/** Google respondió con error (502) o tardó demasiado (504). */
export class MapsUpstreamError extends DomainError {
  constructor(message = "Google Maps no respondió. Intenta de nuevo en un momento.") {
    super(message);
  }
}
