"use client";

import { useActionState } from "react";
import type { Venue } from "../../domain/entities/venue";
import { createVenueAction, updateVenueAction } from "../actions/venue.actions";
import { initialVenueFormState } from "../actions/venue-form-state";

/**
 * Hook fachada polimórfico para el formulario de recintos (registro o edición).
 *
 * - **¿Qué hace?**: Detecta si se está editando un lugar existente (`editing = venue !== undefined`),
 *   selecciona `updateVenueAction` o `createVenueAction` e inicializa el estado con los valores del lugar,
 *   incluyendo latitud y longitud geográficas.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `VenueForm` en `/venues/mine/new` y `/venues/[id]/edit`.
 * - **¿Cuál es su importancia?**: Centraliza la lógica de mutación de recintos físicos, abstrayendo las acciones del servidor de la vista.
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
