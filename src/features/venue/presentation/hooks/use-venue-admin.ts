"use client";

import { useActionState } from "react";
import { deleteVenueAction, verifyVenueAction } from "../actions/venue.actions";

/** Hook fachada de la verificación de un lugar (ADMIN). */
export function useVerifyVenue() {
  const [state, formAction, pending] = useActionState(verifyVenueAction, {});
  return { state, formAction, pending };
}

/** Hook fachada del borrado de un lugar. */
export function useDeleteVenue() {
  const [state, formAction, pending] = useActionState(deleteVenueAction, {});
  return { state, formAction, pending };
}
