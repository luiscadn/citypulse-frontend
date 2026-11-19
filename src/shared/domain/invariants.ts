/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: INVARIANTES, VALIDACIONES DE DOMINIO, DDD, TYPE GUARDS,
 * ISPOSITIVEINT, ISNONBLANK, ISDATESTRING, ISONEOF, REGLAS DE DOMINIO, AUTO VALIDACIÓN
 * =================================================================================================
 *
 * Predicados e Invariantes Comunes de Dominio (Domain Invariants & Type Guards)
 *
 * - **¿Dónde se validan las invariantes de las entidades?**:
 *   En este archivo (`src/shared/domain/invariants.ts`), mediante predicados puros utilizados por
 *   las fábricas `createEvent`, `createUser`, `createVenue`, `createZone`.
 */

/**
 * Comprueba si un valor desconocido es un número entero estrictamente positivo (> 0).
 *
 * - **¿Qué hace?**: Verifica que `value` sea de tipo primitivo `number`, un entero según `Number.isInteger`, y mayor a cero.
 * - **¿Cómo interactúa con el sistema en general?**: Usada para validar identificadores numéricos autonuméricos de base de datos
 *   (ej. `userId`, `zoneId`, `venueId`) y capacidades de aforo de eventos.
 * - **¿Cuál es su importancia?**: Previene identificadores negativos, cero, decimales o `NaN` que generarían fallos en la base de datos o en la API.
 */
export function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Comprueba si un valor desconocido es una cadena de texto no vacía tras eliminar espacios en blanco.
 *
 * - **¿Qué hace?**: Confirma que `value` sea `string` y que `value.trim().length > 0`.
 * - **¿Cómo interactúa con el sistema en general?**: Valida títulos, nombres, descripciones obligatorias, UUIDs y correos en entidades.
 * - **¿Cuál es su importancia?**: Impide que campos de texto requeridos contengan solo espacios en blanco o cadenas vacías.
 */
export function isNonBlank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Comprueba si un valor desconocido es una cadena de fecha que JavaScript puede interpretar válidamente.
 *
 * - **¿Qué hace?**: Verifica que `value` sea `string` y que `Date.parse(value)` no devuelva `NaN` (formato ISO 8601 u homologados).
 * - **¿Cómo interactúa con el sistema en general?**: Valida marcas temporales (`startDate`, `endDate`, `createdAt`) en las fábricas de entidades.
 * - **¿Cuál es su importancia?**: Asegura que cualquier fecha almacenada en una entidad sea operable con la API estándar de fechas sin provocar `Invalid Date`.
 */
export function isDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

/**
 * Comprueba si un valor desconocido pertenece a un arreglo cerrado de opciones permitidas.
 *
 * - **¿Qué hace?**: Verifica que `value` sea `string` y esté incluido en `values`, estrechando el tipo de TypeScript al literal genérico `T`.
 * - **¿Cómo interactúa con el sistema en general?**: Valida la pertenencia de estados y enumeraciones (`EventOrigin`, `EventStatus`, `EventVisibility`, `EvidenceType`).
 * - **¿Cuál es su importancia?**: Asegura la integridad de dominios discretos y previene que datos corruptos de red violen los tipos de unión literales en tiempo de ejecución.
 */
export function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}
