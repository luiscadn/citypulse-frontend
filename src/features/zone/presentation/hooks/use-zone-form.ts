"use client";

import { useActionState } from "react";
import type { Zone } from "../../domain/entities/zone";
import { createZoneAction, updateZoneAction } from "../actions/zone.actions";
import { initialZoneFormState } from "../actions/zone-form-state";

/**
 * Hook fachada polimórfico para el formulario de zonas (creación o edición).
 *
 * - **¿Qué hace?**: Detecta automáticamente si se está editando una zona existente (`editing = zone !== undefined`),
 *   selecciona la Server Action correspondiente (`updateZoneAction` o `createZoneAction`) e inicializa el estado con los valores de la zona.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `ZoneForm` tanto en `/admin/zones/new` como en `/admin/zones/[id]/edit`.
 * - **¿Cuál es su importancia?**: Evita duplicar lógica de formularios entre las vistas de creación y edición,
 *   proporcionando un contrato unificado al componente de UI.
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
