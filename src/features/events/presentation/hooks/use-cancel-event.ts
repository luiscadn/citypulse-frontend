"use client";

import { useActionState } from "react";
import { cancelEventAction } from "../actions/event.actions";

/** Hook fachada de la cancelación de un evento. */
export function useCancelEvent() {
  const [state, formAction, pending] = useActionState(cancelEventAction, {});
  return { state, formAction, pending };
}
