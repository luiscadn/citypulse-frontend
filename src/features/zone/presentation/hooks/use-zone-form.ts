"use client";

import { useActionState } from "react";
import type { Zone } from "../../domain/entities/zone";
import { createZoneAction, updateZoneAction } from "../actions/zone.actions";
import { initialZoneFormState } from "../actions/zone-form-state";

/**
 * Hook fachada del formulario de zona: elige la acción (crear o editar) y
 * expone su estado. El componente no conoce las acciones del servidor.
 */
export function useZoneForm(zone?: Zone) {
  const editing = zone !== undefined;
  const [state, formAction, pending] = useActionState(
    editing ? updateZoneAction : createZoneAction,
    initialZoneFormState(
      editing ? { name: zone.name, description: zone.description ?? "", parentZoneId: "" } : undefined,
    ),
  );
  return { editing, state, formAction, pending };
}
