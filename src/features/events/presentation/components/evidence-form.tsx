"use client";

import { Alert, Button, SelectField, TextField } from "@/shared/presentation/components";
import { EVIDENCE_TYPES } from "../../domain/entities/event";
import { EVIDENCE_CAPTION_MAX_LENGTH, EVIDENCE_URL_MAX_LENGTH } from "../../domain/rules/event-limits";
import { EVIDENCE_LABELS } from "../evidence-labels";
import { useAddEvidence } from "../hooks/use-add-evidence";

/** Adjunta una evidencia (foto, enlace o documento publicados en la web) a un reporte. */
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
