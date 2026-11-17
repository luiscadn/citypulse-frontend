"use client";

import { useActionState } from "react";
import type { Venue } from "../../domain/entities/venue";
import { createVenueAction, updateVenueAction } from "../actions/venue.actions";
import { initialVenueFormState } from "../actions/venue-form-state";

/**
 * Hook fachada del formulario de lugar: elige la acción (registrar o editar)
 * y expone su estado. El componente no conoce las acciones del servidor.
 */
export function useVenueForm(venue?: Venue) {
  const editing = venue !== undefined;
  const [state, formAction, pending] = useActionState(
    editing ? updateVenueAction : createVenueAction,
    initialVenueFormState(
      editing
        ? {
            name: venue.name,
            address: venue.address ?? "",
            description: venue.description ?? "",
            zoneId: String(venue.zone.id),
            latitude: venue.latitude === null ? "" : String(venue.latitude),
            longitude: venue.longitude === null ? "" : String(venue.longitude),
          }
        : undefined,
    ),
  );
  return { editing, state, formAction, pending };
}
