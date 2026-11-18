import { isValidLocation, type VenueDraft, type VenueFilters, type VenueInput } from "../entities/venue";
import {
  InvalidVenueError,
  VenueAddressRequiredError,
  VenueAddressTooLongError,
  VenueDescriptionTooLongError,
  VenueLocationError,
  VenueNameRequiredError,
  VenueNameTooLongError,
  VenueZoneRequiredError,
} from "../errors/venue-errors";
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_DESCRIPTION_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from "./venue-limits";

/**
 * Función auxiliar para verificar si un valor es un entero estrictamente positivo.
 *
 * - **¿Qué hace?**: Evalúa que el número recibido sea entero y mayor que cero.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en validaciones de identificadores y números de página.
 * - **¿Cuál es su importancia?**: Previene identificadores nulos, negativos o decimales.
 */
function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/**
 * Valida si un identificador numérico de lugar es válido.
 *
 * - **¿Qué hace?**: Comprueba que el ID sea un entero positivo.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en casos de uso y aserciones previas a peticiones de red.
 * - **¿Cuál es su importancia?**: Asegura que las rutas dinámicas `/venues/[id]` manejen números válidos.
 */
export function isValidVenueId(id: number): boolean {
  return isPositiveInteger(id);
}

/**
 * Aserción que lanza un error de dominio si el ID de un lugar no es válido.
 *
 * - **¿Qué hace?**: Verifica la validez del ID y lanza `InvalidVenueError` en caso contrario.
 * - **¿Cómo interactúa con el sistema en general?**: Llamada al inicio de use cases como `DeleteVenueUseCase` y `UpdateVenueUseCase`.
 * - **¿Cuál es su importancia?**: Falla tempranamente evitando emitir peticiones a URLs inválidas del backend.
 */
export function assertValidVenueId(id: number): void {
  if (!isValidVenueId(id)) throw new InvalidVenueError();
}

// Campo vacío (NaN, null o undefined) = sin ubicación
function toCoordinate(value: number | null | undefined): number | null {
  return value === null || value === undefined || Number.isNaN(value) ? null : value;
}

/**
 * Normaliza y valida el borrador de un lugar (VenueDraft) produciendo un VenueInput inmutable.
 *
 * - **¿Qué hace?**:
 *   Aplica `trim()` a textos, verifica obligatoriedad de nombre y dirección, comprueba longitudes
 *   máximas y valida que la zona sea un entero positivo.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el punto de entrada de validación en `CreateVenueUseCase` y `UpdateVenueUseCase`.
 *   Lanza errores específicos del dominio que son capturados y convertidos en feedback de UI.
 *
 * - **¿Cuál es su importancia?**:
 *   Actúa como la barrera de pureza de datos en el cliente ("Parse, Don't Validate"),
 *   impidiendo que lleguen payloads corruptos al backend y asegurando consistencia con los DTOs de NestJS.
 */
export function normalizeVenueInput(draft: VenueDraft): VenueInput {
  const name = draft.name.trim();
  if (!name) throw new VenueNameRequiredError();
  if (name.length > VENUE_NAME_MAX_LENGTH) throw new VenueNameTooLongError();

  const address = draft.address.trim();
  if (!address) throw new VenueAddressRequiredError();
  if (address.length > VENUE_ADDRESS_MAX_LENGTH) throw new VenueAddressTooLongError();

  const description = draft.description?.trim() || null;
  if (description && description.length > VENUE_DESCRIPTION_MAX_LENGTH) {
    throw new VenueDescriptionTooLongError();
  }

  if (!isPositiveInteger(draft.zoneId)) throw new VenueZoneRequiredError();

  const latitude = toCoordinate(draft.latitude);
  const longitude = toCoordinate(draft.longitude);
  if (!isValidLocation(latitude, longitude)) throw new VenueLocationError();

  return { name, address, description, zoneId: draft.zoneId, latitude, longitude };
}

/**
 * Extrae y sanea los filtros de búsqueda a partir de los query parameters de la URL.
 *
 * - **¿Qué hace?**:
 *   Convierte strings de la query (`zoneId`, `isVerified`, `page`) en tipos seguros (`number | null`, `boolean | null`, `number`).
 *   Si algún parámetro contiene valores absurdos o maliciosos, lo ignora tolerando el error.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Invocado en el Server Component `VenueList` al recibir `searchParams` para pasárselos al caso de uso.
 *
 * - **¿Cuál es su importancia?**:
 *   Robustez frente a manipulación de URLs: como la barra de direcciones del navegador es pública y editable
 *   por el usuario, la aplicación nunca debe colapsar por parámetros inválidos; en su lugar, se recurre a valores por defecto seguros.
 */
export function parseVenueFilters(raw: {
  zoneId?: string;
  isVerified?: string;
  page?: string;
}): VenueFilters {
  const zoneId = Number(raw.zoneId);
  const page = Number(raw.page);
  return {
    zoneId: isPositiveInteger(zoneId) ? zoneId : null,
    isVerified: raw.isVerified === "true" ? true : raw.isVerified === "false" ? false : null,
    page: isPositiveInteger(page) ? page : 1,
  };
}
