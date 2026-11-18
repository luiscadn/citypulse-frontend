"use client";

import { useActionState } from "react";
import { emptyEvidenceFormValues } from "../actions/event-form-state";
import { addEvidenceAction } from "../actions/evidence.actions";

/**
 * Hook fachada para el formulario de adjuntar evidencias a un reporte.
 *
 * - **¿Qué hace?**: Enlaza la Server Action `addEvidenceAction` con `useActionState`, inicializando los campos
 *   con valores vacíos (`emptyEvidenceFormValues`) y retornando `state`, `formAction` y `pending`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente `EvidenceForm`.
 * - **¿Cuál es su importancia?**: Encapsula el envío asíncrono y los mensajes de error/éxito al subir evidencias.
 */
export function useAddEvidence() {
  const [state, formAction, pending] = useActionState(addEvidenceAction, {
    values: emptyEvidenceFormValues,
    errors: {},
  });
  return { state, formAction, pending };
}
