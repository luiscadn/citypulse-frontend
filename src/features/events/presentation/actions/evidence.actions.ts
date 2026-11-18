"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { eventContainer } from "../../di/event.container";
import {
  EvidenceCaptionTooLongError,
  EvidenceTypeError,
  EvidenceUrlError,
} from "../../domain/errors/event-errors";
import { emptyEvidenceFormValues, type EvidenceFormState, type EvidenceFormValues } from "./event-form-state";

/**
 * Extrae los valores textuales del formulario HTML de evidencia.
 *
 * - **¿Qué hace?**: Obtiene los campos `type`, `url` y `caption` desde la carga útil `FormData`.
 * - **¿Cómo interactúa con el sistema en general?**: Llamada al inicio de `addEvidenceAction`.
 * - **¿Cuál es su importancia?**: Centraliza la extracción y tipado básico de los campos del formulario.
 */
function readValues(formData: FormData): EvidenceFormValues {
  return {
    type: String(formData.get("type") ?? ""),
    url: String(formData.get("url") ?? ""),
    caption: String(formData.get("caption") ?? ""),
  };
}

/**
 * Mapea excepciones de dominio a errores específicos por campo en el estado del formulario.
 *
 * - **¿Qué hace?**: Identifica si el error es de tipo (`EvidenceTypeError`), de URL (`EvidenceUrlError`)
 *   o de descripción (`EvidenceCaptionTooLongError`), asociándolo al input correspondiente.
 * - **¿Cómo interactúa con el sistema en general?**: Transforma fallos de validación en la estructura `EvidenceFormState`.
 * - **¿Cuál es su importancia?**: Mejora la experiencia de usuario presentando mensajes de error inline claros.
 */
function toErrorState(values: EvidenceFormValues, error: unknown): EvidenceFormState {
  const message = actionErrorMessage(error);
  if (error instanceof EvidenceTypeError) return { values, errors: { type: message } };
  if (error instanceof EvidenceUrlError) return { values, errors: { url: message } };
  if (error instanceof EvidenceCaptionTooLongError) return { values, errors: { caption: message } };
  return { values, errors: {}, error: message };
}

/**
 * Server Action: Adjuntar Evidencia a un Evento Reportado
 *
 * - **¿Qué hace?**: Verifica que el usuario tenga sesión activa, extrae los datos del formulario,
 *   invoca `addEvidenceUseCase.execute` y refresca el árbol de componentes del servidor con `refresh()`.
 * - **¿Cómo interactúa con el sistema en general?**: Ejecutada en el servidor por el formulario `EvidenceForm`
 *   a través del hook fachada `useAddEvidence`.
 * - **¿Cuál es su importancia?**: Conecta de forma segura el formulario del cliente con la capa de aplicación,
 *   dejando el formulario listo para adjuntar más evidencias tras un envío exitoso.
 */
export async function addEvidenceAction(_prev: EvidenceFormState, formData: FormData): Promise<EvidenceFormState> {
  const values = readValues(formData);
  if (!(await getCurrentUser())) redirect("/login");

  try {
    await eventContainer.addEvidenceUseCase.execute(String(formData.get("eventId") ?? ""), values);
  } catch (error) {
    return toErrorState(values, error);
  }

  // La lista de evidencias del detalle cambia; el formulario queda listo para otra
  refresh();
  return { values: emptyEvidenceFormValues, errors: {}, success: "Evidencia adjuntada." };
}
