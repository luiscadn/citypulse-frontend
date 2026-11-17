/**
 * Comprobaciones que comparten las fábricas de entidades. Cada entidad decide
 * qué error lanzar; aquí solo vive la pregunta "¿este valor es válido?".
 */

export function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function isNonBlank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Fecha que JavaScript sabe leer (ISO 8601 en la práctica). */
export function isDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}
