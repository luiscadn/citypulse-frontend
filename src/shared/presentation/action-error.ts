import { DomainError } from "@/shared/domain/errors/domain-error";
import { HttpError } from "@/shared/infrastructure/http-client";

/**
 * Función backendMessage
 *
 * - **¿Qué hace?**: Extrae el mensaje de error del payload devuelto por el backend NestJS. Si el backend devuelve un arreglo
 *   de errores de validación (típico de `class-validator`), los une con punto y espacio (`". "`); si viene un string simple lo retorna,
 *   y si no hay mensaje definido recurre al valor por defecto proporcionado (`fallback`).
 * - **¿Cómo interactúa con el sistema en general?**: Es una función de utilidad utilizada por `actionErrorMessage` y por manejadores
 *   de formularios para procesar respuestas de error HTTP 400 (Bad Request).
 * - **¿Cuál es su importancia?**: Asegura que los errores de validación detallados producidos por las anotaciones del backend (DTOs)
 *   lleguen de forma legible y clara al usuario en la interfaz, sin romperse por diferencias en la estructura del JSON.
 */
export function backendMessage(body: unknown, fallback = "Datos inválidos"): string {
  const message = (body as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message.join(". ");
  return message ?? fallback;
}

/**
 * Función actionErrorMessage
 *
 * - **¿Qué hace?**: Traduce cualquier error capturado en una Server Action (instancias de `DomainError`, `HttpError` o excepciones no controladas)
 *   en un mensaje de texto amigable y comprensible para el usuario final.
 *   - Si es `DomainError`: Muestra el mensaje explícito de la regla de negocio violada.
 *   - Si es `HttpError` con 400: Extrae los mensajes de validación del backend usando `backendMessage`.
 *   - Si es `HttpError` con 401: Indica que la sesión expiró.
 *   - Si es `HttpError` con 403: Indica que no se poseen permisos suficientes (control de roles).
 *   - Otros errores (red, servidor caído, etc.): Muestra un mensaje genérico de reintento.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta en los bloques `catch` de todas las Server Actions del proyecto
 *   (`auth.actions.ts`, `event.actions.ts`, `venue.actions.ts`, `zone.actions.ts`, etc.) para poblar el estado de respuesta (`ActionState` o `ActionResult`).
 * - **¿Cuál es su importancia?**: Previene la fuga de detalles técnicos o stack traces sensibles al frontend, al tiempo que asegura
 *   que las violaciones legítimas de reglas de negocio y los errores de validación se comuniquen con absoluta claridad al usuario.
 */
export function actionErrorMessage(error: unknown): string {
  if (error instanceof DomainError) return error.message;
  if (error instanceof HttpError) {
    if (error.status === 400) return backendMessage(error.body);
    if (error.status === 401) return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (error.status === 403) return "No tienes permiso para realizar esta acción.";
  }
  return "No se pudo conectar con el servidor. Intenta de nuevo.";
}
