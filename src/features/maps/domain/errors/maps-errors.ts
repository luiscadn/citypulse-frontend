import { DomainError } from "@/shared/domain/errors/domain-error";
import { PLACE_QUERY_MIN_LENGTH } from "../rules/place-query-limits";

/**
 * Error: PlaceQueryTooShortError
 *
 * - **¿Qué hace?**: Se lanza cuando el término de búsqueda de lugares ingresado por el usuario tiene menos de 3 caracteres (`PLACE_QUERY_MIN_LENGTH`).
 * - **¿Cómo interactúa con el sistema en general?**: Arrojado por la regla de dominio `normalizePlaceQuery` antes de llamar al repositorio.
 * - **¿Cuál es su importancia?**: Evita llamadas inútiles y costosas a la API comercial de Google Places con textos demasiado breves.
 */
export class PlaceQueryTooShortError extends DomainError {
  constructor(message = `Escribe al menos ${PLACE_QUERY_MIN_LENGTH} letras para buscar`) {
    super(message);
  }
}

/**
 * Error: MapsUnavailableError
 *
 * - **¿Qué hace?**: Se lanza cuando el backend no tiene configurada la variable `GOOGLE_MAPS_API_KEY` (HTTP 503 Service Unavailable).
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado en `HttpMapsRepository` y presentado como advertencia en `PlaceSearch`.
 * - **¿Cuál es su importancia?**: Ofrece una degradación elegante del servicio ("graceful degradation"): informa que el buscador automático
 *   no está disponible pero recuerda que el usuario puede ingresar los datos del lugar manualmente en el formulario.
 */
export class MapsUnavailableError extends DomainError {
  constructor(message = "El buscador de Google Maps no está disponible. Llena los datos a mano.") {
    super(message);
  }
}

/**
 * Error: MapsUpstreamError
 *
 * - **¿Qué hace?**: Se lanza cuando los servicios de Google responden con error (HTTP 502 Bad Gateway) o superan el tiempo de espera (HTTP 504 Gateway Timeout).
 * - **¿Cómo interactúa con el sistema en general?**: Se captura en las Server Actions de mapas para informar la indisponibilidad temporal del proveedor externo.
 * - **¿Cuál es su importancia?**: Aísla la falla del proveedor externo (Google) del estado de nuestra propia plataforma.
 */
export class MapsUpstreamError extends DomainError {
  constructor(message = "Google Maps no respondió. Intenta de nuevo en un momento.") {
    super(message);
  }
}
