import { DomainError } from "@/shared/domain/errors/domain-error";
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_DESCRIPTION_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from "../rules/venue-limits";

/**
 * Error lanzado cuando el nombre del lugar está vacío o solo contiene espacios.
 *
 * - **¿Qué hace?**: Comunica que el campo 'nombre' es mandatorio para registrar o actualizar un venue.
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `normalizeVenueInput` y capturado en `venue.actions.ts` para mapearlo al campo visual `name`.
 * - **¿Cuál es su importancia?**: Evita crear registros anónimos o inválidos en la base de datos.
 */
export class VenueNameRequiredError extends DomainError {
  constructor(message = "El nombre del lugar es obligatorio") {
    super(message);
  }
}

/**
 * Error lanzado cuando el nombre excede el límite permitido.
 *
 * - **¿Qué hace?**: Indica que la longitud del nombre superó los caracteres máximos permitidos (`VENUE_NAME_MAX_LENGTH`).
 * - **¿Cómo interactúa con el sistema en general?**: Se evalúa durante la validación temprana en el frontend antes de enviar la solicitud HTTP.
 * - **¿Cuál es su importancia?**: Previene desbordamiento en tablas/bases de datos y discordancias con las restricciones del backend.
 */
export class VenueNameTooLongError extends DomainError {
  constructor(message = `El nombre no puede superar ${VENUE_NAME_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error lanzado cuando la dirección del lugar no fue suministrada.
 *
 * - **¿Qué hace?**: Señala la ausencia de la dirección física requerida para el venue.
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `normalizeVenueInput` y reflejado en el formulario bajo el campo `address`.
 * - **¿Cuál es su importancia?**: Un lugar sin ubicación física carece de sentido práctico en una plataforma de eventos y mapas.
 */
export class VenueAddressRequiredError extends DomainError {
  constructor(message = "La dirección es obligatoria") {
    super(message);
  }
}

/**
 * Error lanzado cuando la dirección física excede el límite establecido.
 *
 * - **¿Qué hace?**: Notifica que el texto de la dirección sobrepasa `VENUE_ADDRESS_MAX_LENGTH`.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado directamente como error del campo de formulario correspondiente.
 * - **¿Cuál es su importancia?**: Protege la integridad de los datos y asegura compatibilidad con APIs de geocodificación.
 */
export class VenueAddressTooLongError extends DomainError {
  constructor(message = `La dirección no puede superar ${VENUE_ADDRESS_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error lanzado cuando la descripción excede la longitud máxima.
 *
 * - **¿Qué hace?**: Notifica que la descripción opcional sobrepasa `VENUE_DESCRIPTION_MAX_LENGTH`.
 * - **¿Cómo interactúa con el sistema en general?**: Valida que la descripción no sobrecargue la base de datos ni desfigure la interfaz de usuario.
 * - **¿Cuál es su importancia?**: Mantiene la consistencia del contenido y previene ataques de inyección de payloads excesivamente largos.
 */
export class VenueDescriptionTooLongError extends DomainError {
  constructor(message = `La descripción no puede superar ${VENUE_DESCRIPTION_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error lanzado cuando no se asocia una zona geográfica al lugar.
 *
 * - **¿Qué hace?**: Advierte que el ID de zona no es un entero positivo válido.
 * - **¿Cómo interactúa con el sistema en general?**: Vinculado al selector de zonas del formulario en la capa de presentación.
 * - **¿Cuál es su importancia?**: La relación entre venue y zona es obligatoria para la búsqueda y filtrado geográfico en la aplicación.
 */
export class VenueZoneRequiredError extends DomainError {
  constructor(message = "Elige la zona donde está el lugar") {
    super(message);
  }
}

export class VenueLocationError extends DomainError {
  constructor(message = "La ubicación no es válida: búscala de nuevo en Google Maps") {
    super(message);
  }
}

/**
 * Error lanzado cuando el identificador o formato del lugar es inválido.
 *
 * - **¿Qué hace?**: Comunica que el ID suministrado no cumple con las restricciones de formato (entero positivo).
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `assertValidVenueId` al recibir parámetros de ruta corruptos.
 * - **¿Cuál es su importancia?**: Falla de manera inmediata (fail-fast) sin realizar llamadas de red inútiles al backend.
 */
export class InvalidVenueError extends DomainError {
  constructor(message = "El lugar no es válido") {
    super(message);
  }
}

/**
 * Error lanzado cuando el lugar solicitado no existe en el sistema.
 *
 * - **¿Qué hace?**: Informa que el recurso identificado no fue encontrado o fue eliminado.
 * - **¿Cómo interactúa con el sistema en general?**: Traducido a partir de respuestas 404 del backend o IDs inválidos en `GetVenueUseCase`, activando `notFound()` en Next.js.
 * - **¿Cuál es su importancia?**: Permite mostrar pantallas de 404 amigables en lugar de fallos no controlados del servidor.
 */
export class VenueNotFoundError extends DomainError {
  constructor(message = "Este lugar ya no existe") {
    super(message);
  }
}

/**
 * Error lanzado cuando la zona seleccionada no existe en el backend.
 *
 * - **¿Qué hace?**: Informa que la clave foránea de zona apuntó a un recurso inexistente.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado desde respuestas 404 durante la creación o actualización de un lugar hacia el campo `zoneId`.
 * - **¿Cuál es su importancia?**: Maneja de forma elegante la integridad referencial rota cuando una zona fue borrada concurrentemente.
 */
export class VenueZoneNotFoundError extends DomainError {
  constructor(message = "La zona elegida ya no existe") {
    super(message);
  }
}

/**
 * Error lanzado cuando ya existe otro lugar con el mismo nombre en la misma zona.
 *
 * - **¿Qué hace?**: Alerta sobre conflicto de unicidad compuesto (nombre + zona).
 * - **¿Cómo interactúa con el sistema en general?**: Traduce un HTTP 409 Conflict del backend y señala error en el campo `name` en el formulario.
 * - **¿Cuál es su importancia?**: Garantiza la regla de negocio que previene duplicidad y confusión de lugares homónimos en la misma localidad.
 */
export class VenueNameTakenError extends DomainError {
  constructor(message = "Ya existe un lugar con ese nombre en esa zona") {
    super(message);
  }
}

/**
 * Error lanzado cuando un usuario intenta editar o eliminar un lugar que no le pertenece.
 *
 * - **¿Qué hace?**: Notifica una violación de autorización en la manipulación del venue.
 * - **¿Cómo interactúa con el sistema en general?**: Traduce un código HTTP 403 Forbidden hacia un mensaje comprensible en la UI.
 * - **¿Cuál es su importancia?**: Resguarda el principio de propiedad y control de acceso entre diferentes usuarios OWNER.
 */
export class VenueForbiddenError extends DomainError {
  constructor(message = "Solo puedes administrar tus propios lugares") {
    super(message);
  }
}
