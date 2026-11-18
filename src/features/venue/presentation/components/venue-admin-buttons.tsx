/**
 * @file venue-admin-buttons.tsx
 * @description Client Components interactivos para acciones administrativas sobre Lugares:
 * botón de verificación oficial y botón destructivo con confirmación de eliminación.
 */

"use client";

import { Alert, Button } from "@/shared/presentation/components";
import { ConfirmSubmit } from "@/shared/presentation/components/confirm-submit";
import { useDeleteVenue, useVerifyVenue } from "../hooks/use-venue-admin";

/**
 * Botón interactivo para certificar y verificar un lugar (restringido a ADMIN).
 *
 * - **¿Qué hace?**:
 *   Envía el formulario con `verifyVenueAction` mediante `useActionState`, mostrando un estado de carga mientras se procesa.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Incrustado en la alerta de lugares pendientes dentro del componente de servidor `VenueDetail`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite a los administradores validar la legitimidad de un espacio con un solo clic y retroalimentación en tiempo real.
 */
export function VerifyVenueButton({ venueId }: { venueId: number }) {
  const { state, formAction, pending } = useVerifyVenue();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="venueId" value={venueId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <div>
        <Button type="submit" loading={pending}>
          {pending ? "Verificando…" : "Verificar lugar"}
        </Button>
      </div>
    </form>
  );
}

/**
 * Botón interactivo para eliminar un lugar tras requerir confirmación explícita.
 *
 * - **¿Qué hace?**:
 *   Muestra un diálogo de confirmación antes de ejecutar `deleteVenueAction`. Si se confirma, envía la solicitud al servidor.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Ubicado en el pie de tarjeta de `VenueDetail` cuando el usuario es OWNER o ADMIN.
 *
 * - **¿Cuál es su importancia?**:
 *   Seguridad de usuario: evita la eliminación accidental de recintos informando claramente que los eventos asociados se conservarán pero quedarán sin lugar asignado.
 */
export function DeleteVenueButton({ venueId, venueName }: { venueId: number; venueName: string }) {
  const { state, formAction, pending } = useDeleteVenue();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="venueId" value={venueId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <ConfirmSubmit
        label="Eliminar lugar"
        pendingLabel="Eliminando…"
        message={`¿Eliminar "${venueName}"? Sus eventos se conservan, pero quedan sin lugar.`}
        pending={pending}
      />
    </form>
  );
}
