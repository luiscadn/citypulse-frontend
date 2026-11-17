import Link from "next/link";
import { Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { eventContainer } from "../../di/event.container";
import { EvidenceList } from "./evidence-list";
import { ReviewReportPanel } from "./review-report-panel";

/**
 * Cola de moderación: reportes en revisión que ya tienen evidencias, del más antiguo
 * al más nuevo. Solo la ve un ADMIN (la página lo comprueba antes). Si falla, error.tsx.
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
