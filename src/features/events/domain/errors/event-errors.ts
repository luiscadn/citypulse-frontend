/**
 * @file event-errors.ts
 * @description Errores de Dominio para el ciclo de vida y validación de Eventos.
 * Heredan de `DomainError` para soportar manejo tipado de excepciones en casos de uso y Server Actions.
 */

import { DomainError } from "@/shared/domain/errors/domain-error";
import { EVENT_ADDRESS_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH } from "../rules/event-limits";

/**
 * Error lanzado cuando el título del evento está vacío o contiene solo espacios.
 *
 * - **¿Qué hace?**: Indica que el campo `title` es obligatorio.
 * - **¿Cómo interactúa con el sistema en general?**: Capturado por `toErrorState` en `event.actions.ts` y reflejado en el input de título.
 * - **¿Cuál es su importancia?**: Evita registrar eventos sin denominación identificativa.
 */
export class EventTitleRequiredError extends DomainError {
  constructor(message = "El título del evento es obligatorio") {
    super(message);
  }
}

/**
 * Error lanzado cuando el título excede la longitud máxima permitida.
 *
 * - **¿Qué hace?**: Comunica que el título sobrepasó `EVENT_TITLE_MAX_LENGTH`.
 * - **¿Cómo interactúa con el sistema en general?**: Evaluado en `normalizeEventInput` para prevención temprana.
 * - **¿Cuál es su importancia?**: Asegura concordancia con las restricciones del backend y base de datos.
 */
export class EventTitleTooLongError extends DomainError {
  constructor(message = `El título no puede superar ${EVENT_TITLE_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error lanzado cuando la dirección libre del evento excede el límite permitido.
 *
 * - **¿Qué hace?**: Informa que `addressText` supera los `EVENT_ADDRESS_MAX_LENGTH` caracteres.
 * - **¿Cómo interactúa con el sistema en general?**: Señala un error visual sobre el campo `addressText`.
 * - **¿Cuál es su importancia?**: Previene desbordamiento en columnas de almacenamiento de Postgres.
 */
export class EventAddressTooLongError extends DomainError {
  constructor(message = `La dirección no puede superar ${EVENT_ADDRESS_MAX_LENGTH} caracteres`) {
    super(message);
  }
}

/**
 * Error lanzado cuando no se especifica una zona válida para el evento.
 *
 * - **¿Qué hace?**: Alerta sobre la ausencia de un ID de zona numérico positivo.
 * - **¿Cómo interactúa con el sistema en general?**: Dirige el foco de corrección al selector `zoneId` del formulario.
 * - **¿Cuál es su importancia?**: Todo evento debe estar geolocalizado en una comuna o corregimiento para el filtrado territorial.
 */
export class EventZoneRequiredError extends DomainError {
  constructor(message = "Elige la zona donde ocurre el evento") {
    super(message);
  }
}

/**
 * Error lanzado cuando falta la fecha y hora de inicio del evento o no tiene formato válido.
 *
 * - **¿Qué hace?**: Indica que la fecha de inicio es requerida y debe corresponder a un instante temporal válido.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado al campo `startDate` del formulario.
 * - **¿Cuál es su importancia?**: Garantiza la cronología indispensable para agendar eventos.
 */
export class EventStartDateRequiredError extends DomainError {
  constructor(message = "Indica cuándo empieza el evento") {
    super(message);
  }
}

/**
 * Error lanzado cuando falta la fecha y hora de finalización del evento o no es válida.
 *
 * - **¿Qué hace?**: Indica que la fecha de fin es obligatoria y debe ser computable.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado al campo `endDate` del formulario.
 * - **¿Cuál es su importancia?**: Delimita la duración prevista del evento en el calendario.
 */
export class EventEndDateRequiredError extends DomainError {
  constructor(message = "Indica cuándo termina el evento") {
    super(message);
  }
}

/**
 * Error lanzado cuando la fecha de finalización es anterior o idéntica a la fecha de inicio.
 *
 * - **¿Qué hace?**: Valida la relación cronológica: `endDate > startDate`.
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `normalizeEventInput` y asignado como error en el campo `endDate`.
 * - **¿Cuál es su importancia?**: Regla de consistencia temporal estricta: un evento no puede concluir antes de comenzar.
 */
export class EventDatesOrderError extends DomainError {
  constructor(message = "El evento debe terminar después de empezar") {
    super(message);
  }
}

/**
 * Error lanzado cuando el identificador del evento no cumple con el formato UUID.
 *
 * - **¿Qué hace?**: Comprueba el formato UUID antes de realizar consultas de red.
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `assertValidEventId` en casos de uso.
 * - **¿Cuál es su importancia?**: Falla de manera inmediata (fail-fast) protegiendo al backend de consultas maliciosas o corruptas.
 */
export class InvalidEventError extends DomainError {
  constructor(message = "El evento no es válido") {
    super(message);
  }
}

/**
 * Error lanzado cuando un evento solicitado no existe en la base de datos.
 *
 * - **¿Qué hace?**: Indica ausencia del recurso solicitado.
 * - **¿Cómo interactúa con el sistema en general?**: Traduce respuestas HTTP 404 y activa `notFound()` en Next.js.
 * - **¿Cuál es su importancia?**: Despliega la página 404 oficial de la aplicación de manera ordenada.
 */
export class EventNotFoundError extends DomainError {
  constructor(message = "Este evento ya no existe") {
    super(message);
  }
}

/**
 * Error lanzado cuando la zona geográfica asignada al evento no existe.
 *
 * - **¿Qué hace?**: Alerta sobre la rotura de integridad referencial con la zona elegida.
 * - **¿Cómo interactúa con el sistema en general?**: Capturado en creación y actualización y vinculado al selector `zoneId`.
 * - **¿Cuál es su importancia?**: Maneja de forma controlada la eliminación concurrente de zonas geográficas.
 */
export class EventZoneNotFoundError extends DomainError {
  constructor(message = "La zona elegida ya no existe") {
    super(message);
  }
}

/**
 * Error lanzado cuando un usuario sin privilegios intenta acceder a un evento privado.
 *
 * - **¿Qué hace?**: Deniega el acceso a eventos privados salvo para autor, administradores o invitados confirmados.
 * - **¿Cómo interactúa con el sistema en general?**: Traduce un HTTP 403 en `findById` y genera un banner informativo en `EventDetail`.
 * - **¿Cuál es su importancia?**: Asegura la privacidad de eventos exclusivos o de acceso restringido.
 */
export class EventPrivateError extends DomainError {
  constructor(message = "No tienes acceso a este evento privado") {
    super(message);
  }
}

/**
 * Error lanzado cuando un usuario intenta modificar o cancelar un evento sin ser su autor ni administrador.
 *
 * - **¿Qué hace?**: Bloquea acciones de modificación no autorizadas.
 * - **¿Cómo interactúa con el sistema en general?**: Mapea respuestas HTTP 403 del backend.
 * - **¿Cuál es su importancia?**: Protege la autoría y soberanía de los eventos registrados.
 */
export class EventForbiddenError extends DomainError {
  constructor(message = "Solo el autor del evento o un administrador puede hacer esto") {
    super(message);
  }
}

/**
 * Error lanzado cuando se intenta editar un evento que ya fue revisado (confirmado, rechazado o cancelado).
 *
 * - **¿Qué hace?**: Hace cumplir la regla de que solo los reportes con estado `REPORTADO` admiten edición (RF-3.5).
 * - **¿Cómo interactúa con el sistema en general?**: Impide alteraciones posteriores a la decisión de los moderadores.
 * - **¿Cuál es su importancia?**: Mantiene la inmutabilidad de los eventos una vez que han sido avalados o dictaminados oficialmente.
 */
export class EventNotEditableError extends DomainError {
  constructor(message = "Solo se puede editar un reporte que aún no ha sido revisado") {
    super(message);
  }
}

/**
 * Error lanzado al intentar cancelar un evento que ya se encontraba en estado cancelado.
 *
 * - **¿Qué hace?**: Detecta intentos redundantes de cancelación.
 * - **¿Cómo interactúa con el sistema en general?**: Traduce errores de transición de estado desde el backend.
 * - **¿Cuál es su importancia?**: Mantiene la consistencia de la máquina de estados de los eventos.
 */
export class EventAlreadyCancelledError extends DomainError {
  constructor(message = "El evento ya está cancelado") {
    super(message);
  }
}
