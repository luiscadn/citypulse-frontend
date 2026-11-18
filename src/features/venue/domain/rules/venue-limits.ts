/**
 * @file venue-limits.ts
 * @description Constantes de Dominio que definen los límites cuantitativos y restricciones
 * de tamaño para las entidades de Lugares (Venues), alineadas con los DTOs del backend.
 */

/**
 * Longitud máxima en caracteres permitida para el nombre de un lugar.
 *
 * - **¿Qué hace?**: Fija el tope de longitud (120 caracteres) para el campo `name`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado en validaciones de formulario (`maxLength`), mensajes de error y validación de dominio (`normalizeVenueInput`).
 * - **¿Cuál es su importancia?**: Mantiene coherencia estricta con la restricción de base de datos y CreateVenueDto del backend.
 */
export const VENUE_NAME_MAX_LENGTH = 120;

/**
 * Longitud máxima en caracteres permitida para la dirección física de un lugar.
 *
 * - **¿Qué hace?**: Fija el tope de longitud (200 caracteres) para el campo `address`.
 * - **¿Cómo interactúa con el sistema en general?**: Aplicado en los inputs de UI y en la regla de dominio de saneamiento.
 * - **¿Cuál es su importancia?**: Garantiza compatibilidad con las especificaciones de almacenamiento del servidor.
 */
export const VENUE_ADDRESS_MAX_LENGTH = 200;

/**
 * Longitud máxima en caracteres permitida para la descripción de un lugar.
 *
 * - **¿Qué hace?**: Fija el tope de longitud (255 caracteres) para el campo opcional `description`.
 * - **¿Cómo interactúa con el sistema en general?**: Limita la extensión de las áreas de texto (`TextareaField`) en la vista de creación y edición.
 * - **¿Cuál es su importancia?**: Evita textos excesivamente largos que comprometan el diseño o el rendimiento de renderizado.
 */
export const VENUE_DESCRIPTION_MAX_LENGTH = 255;

/**
 * Cantidad de lugares a mostrar por página en los listados paginados.
 *
 * - **¿Qué hace?**: Define el tamaño de página estándar (12 elementos) para las consultas de venues.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `HttpVenueRepository.list` al componer el query parameter `limit`.
 * - **¿Cuál es su importancia?**: Establece un número óptimo para layouts en cuadrícula responsiva (múltiplo de 1, 2, 3 y 4 columnas).
 */
export const VENUES_PAGE_SIZE = 12;
