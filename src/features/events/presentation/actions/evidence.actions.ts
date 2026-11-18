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

function readValues(formData: FormData): EvidenceFormValues {
  return {
    type: String(formData.get("type") ?? ""),
    url: String(formData.get("url") ?? ""),
    caption: String(formData.get("caption") ?? ""),
  };
}

function toErrorState(values: EvidenceFormValues, error: unknown): EvidenceFormState {
  const message = actionErrorMessage(error);
  if (error instanceof EvidenceTypeError) return { values, errors: { type: message } };
  if (error instanceof EvidenceUrlError) return { values, errors: { url: message } };
  if (error instanceof EvidenceCaptionTooLongError) return { values, errors: { caption: message } };
  return { values, errors: {}, error: message };
}

/** Adjunta una evidencia al reporte. El backend decide si es su autor o un ADMIN (403 si no). */
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
