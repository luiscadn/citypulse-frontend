import { Badge } from "@/shared/presentation/components";
import type { EventEvidence } from "../../domain/entities/event";
import { isWebUrl } from "../../domain/rules/event-input";
import { EVIDENCE_LABELS } from "../evidence-labels";

/** Evidencias de un reporte. Solo se enlazan direcciones web: la URL la escribe cualquier usuario. */
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
