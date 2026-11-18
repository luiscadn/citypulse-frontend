"use client";

import { Alert, Button, SelectField, TextField } from "@/shared/presentation/components";
import { EVIDENCE_TYPES } from "../../domain/entities/event";
import { EVIDENCE_CAPTION_MAX_LENGTH, EVIDENCE_URL_MAX_LENGTH } from "../../domain/rules/event-limits";
import { EVIDENCE_LABELS } from "../evidence-labels";
import { useAddEvidence } from "../hooks/use-add-evidence";

/**
 * Formulario interactivo para adjuntar evidencias que respalden un reporte de evento.
 *
 * - **¿Qué hace?**: Renderiza controles para seleccionar el tipo de prueba (`FOTO`, `ENLACE`, `DOCUMENTO`),
 *   el enlace web público (`url`) y una descripción explicativa (`caption`). Utiliza el hook fachada `useAddEvidence`
 *   para gestionar el estado y la acción del servidor.
 * - **¿Cómo interactúa con el sistema en general?**: Incrustado en la página de detalle de evento (`EventDetail`)
 *   cuando el reporte está pendiente y el usuario en sesión es el autor o un administrador.
 * - **¿Cuál es su importancia?**: Permite cumplir el requisito funcional RF-3.4 facilitando la carga de pruebas
 *   sin recargas completas de página y mostrando errores inline si la URL o el tipo son incorrectos.
 */
export function EvidenceForm({ eventId }: { eventId: string }) {
  const { state, formAction, pending } = useAddEvidence();

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="eventId" value={eventId} />
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <SelectField label="Tipo" name="type" required defaultValue={state.values.type} error={state.errors.type}>
        {EVIDENCE_TYPES.map((type) => (
          <option key={type} value={type}>
            {EVIDENCE_LABELS[type]}
          </option>
        ))}
      </SelectField>
      <TextField
        label="Enlace"
        name="url"
        type="url"
        required
        maxLength={EVIDENCE_URL_MAX_LENGTH}
        placeholder="https://…"
        hint="Dónde está publicada: la foto, la noticia o el documento."
        autoComplete="off"
        defaultValue={state.values.url}
        error={state.errors.url}
      />
      <TextField
        label="Descripción"
        name="caption"
        maxLength={EVIDENCE_CAPTION_MAX_LENGTH}
        placeholder="Ej.: Carpas montándose en la plaza"
        hint="Opcional."
        defaultValue={state.values.caption}
        error={state.errors.caption}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Adjuntando…" : "Adjuntar evidencia"}
        </Button>
      </div>
    </form>
  );
}
