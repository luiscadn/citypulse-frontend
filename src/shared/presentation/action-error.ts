import { DomainError } from "@/shared/domain/errors/domain-error";
import { HttpError } from "@/shared/infrastructure/http-client";

/** message del backend NestJS: string o lista de errores de validación */
export function backendMessage(body: unknown, fallback = "Datos inválidos"): string {
  const message = (body as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message.join(". ");
  return message ?? fallback;
}

/**
 * Convierte cualquier error de una Server Action en un texto para el usuario:
 * errores de dominio → su mensaje; 400 → mensaje de validación del backend;
 * 401 → sesión vencida; el resto → problema de conexión.
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
