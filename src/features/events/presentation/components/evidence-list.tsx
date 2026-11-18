import { Badge } from "@/shared/presentation/components";
import type { EventEvidence } from "../../domain/entities/event";
import { isWebUrl } from "../../domain/rules/event-input";
import { EVIDENCE_LABELS } from "../evidence-labels";

/**
 * Componente de presentación para listar las evidencias adjuntas a un evento.
 *
 * - **¿Qué hace?**: Renderiza una lista accesible de evidencias mostrando una insignia (`Badge`) con el tipo de evidencia,
 *   y un enlace web seguro (`<a>` con `rel="noopener noreferrer"`) solo si la URL es un protocolo web válido (`isWebUrl`).
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en `EventDetail` y en cada tarjeta de reporte dentro de `ModerationQueue`.
 * - **¿Cuál es su importancia?**: Ofrece a moderadores y asistentes acceso directo a las fuentes de verificación ciudadana,
 *   mitigando riesgos de enlaces maliciosos mediante la validación previa con `isWebUrl`.
 */
export function EvidenceList({ evidences }: { evidences: readonly EventEvidence[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {evidences.map((evidence) => (
        <li key={evidence.id} className="flex flex-wrap items-center gap-2">
          <Badge>{EVIDENCE_LABELS[evidence.type]}</Badge>
          {isWebUrl(evidence.url) ? (
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold break-all text-primary-strong hover:underline"
            >
              {evidence.caption ?? evidence.url} ↗
            </a>
          ) : (
            <span className="break-all text-ink">{evidence.caption ?? evidence.url}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
