"use client";

import { useActionState } from "react";
import { deleteZoneAction } from "../actions/zone.actions";

/** Hook fachada del borrado de una zona. */
export function useDeleteZone() {
  const [state, formAction, pending] = useActionState(deleteZoneAction, {});
  return { state, formAction, pending };
}
