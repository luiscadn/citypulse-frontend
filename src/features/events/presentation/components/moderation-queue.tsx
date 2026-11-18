import Link from "next/link";
import { Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { eventContainer } from "../../di/event.container";
import { EvidenceList } from "./evidence-list";
import { ReviewReportPanel } from "./review-report-panel";

/**
 * Server Component de la Bandeja de Entrada de Moderación (Cola de Reportes)
 *
 * - **¿Qué hace?**: Recupera de forma asíncrona todos los reportes comunitarios en revisión a través de
 *   `eventContainer.listPendingReportsUseCase.execute()`. Si no hay reportes pendientes, muestra un `EmptyState`.
 *   Si existen, renderiza tarjetas estructuradas con autor, fecha, zona, evidencias y el panel de revisión (`ReviewReportPanel`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumido exclusivamente por la página administrativa `/admin/moderation`.
 * - **¿Cuál es su importancia?**: Centraliza el flujo de auditoría administrativa (RF-4.1), permitiendo a los moderadores
 *   evaluar las evidencias y emitir una decisión (confirmar o rechazar) en un único lugar.
 */
export async function ModerationQueue() {
  const reports = await eventContainer.listPendingReportsUseCase.execute();

  if (reports.length === 0) {
    return (
      <EmptyState
        title="No hay reportes por revisar"
        description="Aquí aparecen los reportes en revisión en cuanto su autor adjunta una evidencia."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader
            title={
              <Link href={`/events/${report.id}`} className="hover:underline">
                {report.title}
              </Link>
            }
            description={`${report.zone.name} · ${formatDateTime(report.startDate)} · reportado por ${report.createdBy.fullName} (@${report.createdBy.username})`}
          />
          <CardBody className="flex flex-col gap-4">
            {report.description && <p className="text-sm text-ink">{report.description}</p>}
            <EvidenceList evidences={report.evidences} />
            <ReviewReportPanel eventId={report.id} />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
