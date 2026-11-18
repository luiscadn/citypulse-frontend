"use client";

import { Alert } from "@/shared/presentation/components";
import { ConfirmSubmit } from "@/shared/presentation/components/confirm-submit";
import { useDeleteZone } from "../hooks/use-delete-zone";

/**
 * Componente DeleteZoneButton: Botón destructivo para eliminar una zona urbana.
 *
 * - **¿Qué hace?**: Renderiza un formulario cliente vinculado a la Server Action `deleteZoneAction` mediante `useActionState`.
 *   Incluye un campo oculto con `zoneId`, muestra alertas de error (`Alert danger`) si la eliminación falla,
 *   y utiliza `ConfirmSubmit` para requerir confirmación explícita antes de proceder.
 * - **¿Cómo interactúa con el sistema en general?**: Se integra en la tarjeta de administración de `ZoneDetail`.
 *   Si el backend rechaza el borrado porque la zona tiene eventos o lugares vinculados (`ZoneInUseError`),
 *   el mensaje de error se muestra de inmediato sobre el botón.
 * - **¿Cuál es su importancia?**: Previene la pérdida accidental de datos proporcionando una experiencia de usuario
 *   segura y amigable para operaciones irreversibles.
 */
export function DeleteZoneButton({ zoneId, zoneName }: { zoneId: number; zoneName: string }) {
  const { state, formAction, pending } = useDeleteZone();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="zoneId" value={zoneId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <ConfirmSubmit
        label="Eliminar zona"
        pendingLabel="Eliminando…"
        message={`¿Eliminar la zona "${zoneName}"? Esta acción no se puede deshacer.`}
        pending={pending}
      />
    </form>
  );
}
