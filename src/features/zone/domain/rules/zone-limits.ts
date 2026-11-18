/**
 * Constantes de límites de longitud para atributos de Zone
 *
 * - **¿Qué hace?**: Fija los límites numéricos de longitud máxima para nombres (`ZONE_NAME_MAX_LENGTH` = 120)
 *   y descripciones (`ZONE_DESCRIPTION_MAX_LENGTH` = 255) de zonas urbanas.
 * - **¿Cómo interactúa con el sistema en general?**: Se sincroniza exactamente con los decoradores `@Length` de `CreateZoneDto`
 *   en el backend NestJS. Es utilizada por `normalizeZoneInput`, las clases de error y los atributos `maxLength` de los formularios HTML.
 * - **¿Cuál es su importancia?**: Garantiza consistencia estricta entre la validación de cliente, las reglas de negocio del dominio
 *   y las restricciones de esquema de la base de datos relacional.
 */
export const ZONE_NAME_MAX_LENGTH = 120;
export const ZONE_DESCRIPTION_MAX_LENGTH = 255;
