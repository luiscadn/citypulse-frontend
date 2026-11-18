/**
 * @file event-limits.ts
 * @description Constantes de Dominio que definen los límites cuantitativos y restricciones
 * de tamaño para los atributos de Eventos, acordes con CreateReportDto y QueryEventsDto del backend.
 */

/**
 * Longitud máxima permitida en caracteres para el título de un evento.
 *
 * - **¿Qué hace?**: Fija el tope de longitud (150 caracteres) para el campo `title`.
 * - **¿Cómo interactúa con el sistema en general?**: Aplicado en atributos `maxLength` de formularios y en `normalizeEventInput`.
 * - **¿Cuál es su importancia?**: Evita títulos desmedidos asegurando compatibilidad con la base de datos relacional.
 */
export const EVENT_TITLE_MAX_LENGTH = 150;

/**
 * Longitud máxima en caracteres para la dirección libre del evento.
 *
 * - **¿Qué hace?**: Fija el tope de longitud (255 caracteres) para el campo `addressText`.
 * - **¿Cómo interactúa con el sistema en general?**: Controlado en el input de dirección y validado en el dominio.
 * - **¿Cuál es su importancia?**: Restringe la extensión del texto libre cuando no se usa un local registrado.
 */
export const EVENT_ADDRESS_MAX_LENGTH = 255;

/**
 * Longitud máxima en caracteres permitida para la cadena de búsqueda libre en el listado de eventos.
 *
 * - **¿Qué hace?**: Limita a 100 caracteres el término de búsqueda de texto `search`.
 * - **¿Cómo interactúa con el sistema en general?**: Usado en `parseEventFilters` y en el input de búsqueda de `EventFilters`.
 * - **¿Cuál es su importancia?**: Previene consultas excesivamente largas que sobrecarguen el motor de búsqueda del backend.
 */
export const EVENT_SEARCH_MAX_LENGTH = 100;

/**
 * Cantidad de eventos por página en los listados paginados.
 *
 * - **¿Qué hace?**: Define el límite por defecto (12 elementos) para cada página de eventos.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en `HttpEventRepository.list` al construir el query parameter `limit`.
 * - **¿Cuál es su importancia?**: Provee una cuadrícula armónica y balanceada para visualización de tarjetas responsivas.
 */
export const EVENTS_PAGE_SIZE = 12;

/** Mismos límites que CreateEvidenceDto y RejectEventDto del backend. */
export const EVIDENCE_URL_MAX_LENGTH = 500;
export const EVIDENCE_CAPTION_MAX_LENGTH = 255;
export const REJECTION_REASON_MAX_LENGTH = 255;
