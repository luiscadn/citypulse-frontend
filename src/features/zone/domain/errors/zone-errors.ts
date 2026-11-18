import { DomainError } from "@/shared/domain/errors/domain-error";
import { ZONE_DESCRIPTION_MAX_LENGTH, ZONE_NAME_MAX_LENGTH } from "../rules/zone-limits";

/**
 * Error: ZoneNameRequiredError
 *
 * - **¿Qué hace?**: Se lanza cuando el nombre de la zona está vacío o contiene solo espacios en blanco.
 * - **¿Cómo interactúa con el sistema en general?**: Es lanzado por `normalizeZoneInput` y capturado en las Server Actions
 *   para marcar el campo `name` como inválido.
 * - **¿Cuál es su importancia?**: Garantiza la presencia obligatoria del nombre de la zona como identificador legible para los usuarios.
 */
export class ZoneNameRequiredError extends DomainError {
  constructor(message = "El nombre de la zona es obligatorio") {
    super(message);
  }
}

/**
 * Error: ZoneNameTooLongError
 *
 * - **¿Qué hace?**: Se lanza cuando el nombre supera la longitud máxima permitida (`ZONE_NAME_MAX_LENGTH` = 120 caracteres).
 * - **¿Cómo interactúa con el sistema en general?**: Previene desbordamientos en base de datos al validar el campo antes de la llamada HTTP.
 * - **¿Cuál es su importancia?**: Mantiene la concordancia con las restricciones de la base de datos relacional y previene ataques de inyección de cadenas masivas.
 */
export class ZoneNameTooLongError extends DomainError {
  constructor(message = `El nombre no puede superar ${ZONE_NAME_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error: ZoneDescriptionTooLongError
 *
 * - **¿Qué hace?**: Se lanza cuando la descripción supera los 255 caracteres (`ZONE_DESCRIPTION_MAX_LENGTH`).
 * - **¿Cómo interactúa con el sistema en general?**: Protege la integridad de las columnas de base de datos (`VARCHAR(255)`).
 * - **¿Cuál es su importancia?**: Evita errores 500 en el backend por exceso de longitud en campos de texto descriptivos.
 */
export class ZoneDescriptionTooLongError extends DomainError {
  constructor(message = `La descripción no puede superar ${ZONE_DESCRIPTION_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error: InvalidZoneError
 *
 * - **¿Qué hace?**: Se lanza cuando un identificador numérico de zona no es un entero positivo válido o es estructuralmente corrupto.
 * - **¿Cómo interactúa con el sistema en general?**: Es arrojado por `assertValidZoneId` en casos de uso de obtención o eliminación.
 * - **¿Cuál es su importancia?**: Falla de forma temprana (fail-fast) sin realizar peticiones HTTP inútiles hacia el backend.
 */
export class InvalidZoneError extends DomainError {
  constructor(message = "La zona no es válida") {
    super(message);
  }
}

/**
 * Error: ZoneSelfParentError
 *
 * - **¿Qué hace?**: Se lanza cuando se intenta asignar una zona como su propia zona padre (`parentZoneId === zoneId`).
 * - **¿Cómo interactúa con el sistema en general?**: Es comprobado en `normalizeZoneInput` durante la edición de zonas.
 * - **¿Cuál es su importancia?**: Previene la creación de ciclos infinitos o referencias recursivas que romperían la representación en árbol del frontend y la integridad relacional del backend.
 */
export class ZoneSelfParentError extends DomainError {
  constructor(message = "Una zona no puede ser su propia zona padre") {
    super(message);
  }
}

/**
 * Error: ZoneNotFoundError
 *
 * - **¿Qué hace?**: Indica que la zona solicitada por su ID no existe en el sistema o fue eliminada previamente.
 * - **¿Cómo interactúa con el sistema en general?**: Se mapea a partir de respuestas HTTP 404 del backend en `HttpZoneRepository.findById`.
 *   En la capa de presentación desencadena la función `notFound()` de Next.js.
 * - **¿Cuál es su importancia?**: Permite mostrar la página estándar 404 de Next.js cuando un usuario consulta una URL inválida.
 */
export class ZoneNotFoundError extends DomainError {
  constructor(message = "Esta zona ya no existe") {
    super(message);
  }
}

/**
 * Error: ZoneParentNotFoundError
 *
 * - **¿Qué hace?**: Se lanza cuando se especifica un `parentZoneId` que no corresponde a ninguna zona existente en la base de datos.
 * - **¿Cómo interactúa con el sistema en general?**: Se captura en las Server Actions para asociar el error al selector de zona padre.
 * - **¿Cuál es su importancia?**: Proporciona retroalimentación precisa al usuario cuando una zona padre fue eliminada concurrentemente por otro administrador.
 */
export class ZoneParentNotFoundError extends DomainError {
  constructor(message = "La zona padre ya no existe") {
    super(message);
  }
}

/**
 * Error: ZoneNameTakenError
 *
 * - **¿Qué hace?**: Se lanza cuando ya existe otra zona con el mismo nombre en la base de datos (restricción UNIQUE).
 * - **¿Cómo interactúa con el sistema en general?**: Se mapea desde respuestas HTTP 409 (Conflict) en el repositorio HTTP.
 * - **¿Cuál es su importancia?**: Evita colisiones de nombres y confusión entre zonas homónimas en la misma ciudad.
 */
export class ZoneNameTakenError extends DomainError {
  constructor(message = "Ya existe una zona con ese nombre") {
    super(message);
  }
}

/**
 * Error: ZoneInUseError
 *
 * - **¿Qué hace?**: Se lanza cuando se intenta eliminar una zona que aún tiene lugares (`venues`) o eventos (`events`) asociados (restricción de clave foránea `RESTRICT`).
 * - **¿Cómo interactúa con el sistema en general?**: Es capturado por `deleteZoneAction` y mostrado como alerta en el componente `DeleteZoneButton`.
 * - **¿Cuál es su importancia?**: Protege la integridad referencial y explica claramente al administrador por qué no se puede borrar la zona sin antes reubicar o eliminar sus lugares y eventos asociados.
 */
export class ZoneInUseError extends DomainError {
  constructor(message = "No se puede eliminar: la zona tiene lugares o eventos asociados") {
    super(message);
  }
}
