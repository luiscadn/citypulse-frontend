"use client";

import { useActionState } from "react";
import { Alert, Button, SelectField, TextareaField, TextField } from "@/shared/presentation/components";
import type { Zone } from "../../domain/entities/zone";
import { ZONE_DESCRIPTION_MAX_LENGTH, ZONE_NAME_MAX_LENGTH } from "../../domain/rules/zone-limits";
import { createZoneAction, updateZoneAction } from "../actions/zone.actions";
import { initialZoneFormState } from "../actions/zone-form-state";

type ZoneOption = Pick<Zone, "id" | "name">;

/**
 * Componente ZoneForm: Formulario unificado para la creación y edición de zonas urbanas.
 *
 * - **¿Qué hace?**: Permite ingresar o modificar el nombre, la descripción y la zona padre.
 *   Si recibe una prop `zone`, opera en modo edición vinculándose a `updateZoneAction`; si no, opera en modo creación
 *   con `createZoneAction`. Filtra las opciones de zonas padre para evitar que una zona se seleccione a sí misma.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en `ZoneList` (modo creación en panel lateral)
 *   y en `ZoneDetail` (modo edición para administradores). Conecta directamente con las Server Actions usando `useActionState`.
 * - **¿Cuál es su importancia?**: Reutiliza la misma interfaz accesible y validada tanto para crear como para editar,
 *   garantizando coherencia visual y evitando la duplicación de controles de formulario.
 */
export function ZoneForm({ zone, parentOptions }: { zone?: Zone; parentOptions: readonly ZoneOption[] }) {
  const editing = zone !== undefined;
  const [state, formAction, pending] = useActionState(
    editing ? updateZoneAction : createZoneAction,
    initialZoneFormState(
      editing
        ? { name: zone.name, description: zone.description ?? "", parentZoneId: "" }
        : undefined,
    ),
  );

  // Una zona no puede ser su propia zona padre: ni siquiera se ofrece
  const options = parentOptions.filter((option) => option.id !== zone?.id);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}
      {editing && <input type="hidden" name="zoneId" value={zone.id} />}

      <TextField
        label="Nombre"
        name="name"
        required
        maxLength={ZONE_NAME_MAX_LENGTH}
        placeholder="Ej.: San Antonio…"
        autoComplete="off"
        defaultValue={state.values.name}
        error={state.errors.name}
      />
      <TextareaField
        label="Descripción"
        name="description"
        rows={3}
        maxLength={ZONE_DESCRIPTION_MAX_LENGTH}
        placeholder="Ej.: Barrio turístico de la comuna 3…"
        hint="Opcional."
        defaultValue={state.values.description}
        error={state.errors.description}
      />
      <SelectField
        label={editing ? "Mover dentro de otra zona" : "Zona padre"}
        name="parentZoneId"
        hint={
          editing
            ? "Opcional. Déjalo sin cambiar para conservar la zona padre actual."
            : "Opcional. Si esta zona está dentro de otra (un barrio dentro de una comuna)."
        }
        defaultValue={state.values.parentZoneId}
        error={state.errors.parentZoneId}
      >
        <option value="">{editing ? "Sin cambiar" : "Ninguna"}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectField>

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear zona"}
        </Button>
      </div>
    </form>
  );
}
