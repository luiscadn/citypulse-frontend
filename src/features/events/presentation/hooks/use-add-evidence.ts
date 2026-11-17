"use client";

import { useActionState } from "react";
import { emptyEvidenceFormValues } from "../actions/event-form-state";
import { addEvidenceAction } from "../actions/evidence.actions";

/** Hook fachada del formulario para adjuntar evidencias. */
export function useAddEvidence() {
  const [state, formAction, pending] = useActionState(addEvidenceAction, {
    values: emptyEvidenceFormValues,
    errors: {},
  });
  return { state, formAction, pending };
}
