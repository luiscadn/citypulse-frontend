"use client";

import { useActionState } from "react";
import { emptyOfficialEventFormValues } from "../actions/event-form-state";
import { publishOfficialEventAction } from "../actions/official-event.actions";

/** Hook fachada del formulario de evento oficial. */
export function useOfficialEventForm() {
  const [state, formAction, pending] = useActionState(publishOfficialEventAction, {
    values: emptyOfficialEventFormValues,
    errors: {},
  });
  return { state, formAction, pending };
}
