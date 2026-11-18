import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { EventAttendance } from "@/features/attendance/presentation/components/event-attendance";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { InviteFriends } from "@/features/invitation/presentation/components/invite-friends";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { EventOrigin, EventStatus } from "@/shared/domain/enums";
import { Alert, Badge, Card, CardBody, CardHeader, PageHeader } from "@/shared/presentation/components";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { eventContainer } from "../../di/event.container";
import type { EventDetail as EventDetailData } from "../../domain/entities/event";
import { EventNotFoundError, EventPrivateError } from "../../domain/errors/event-errors";
import {
  canAddEvidence,
  canCancelEvent,
  canEditEvent,
  canModerateEvents,
  canSeeAttendees,
} from "../../domain/rules/event-permissions";
import { CancelEventButton } from "./cancel-event-button";
import { EventForm } from "./event-form";
import { EvidenceForm } from "./evidence-form";
import { EvidenceList } from "./evidence-list";
import { EventStatusBadge } from "./event-status-badge";
import { ReviewReportPanel } from "./review-report-panel";

/** Formateador de moneda en pesos colombianos (COP). */
const priceFormat = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/**
 * Componente de servidor para la ficha completa de un evento.
 *
 * - **¿Qué hace?**:
 *   Resuelve la promesa de ID de la ruta, consulta los datos con `getEventUseCase` (manejando 404 o restricción por evento privado),
 *   obtiene la sesión y determina permisos (`canEditEvent`, `canCancelEvent`), y renderiza:
 *   migas de pan, encabezado con insignias de estado y origen, banners informativos según el estado (cancelado, rechazado o en revisión),
 *   resumen estructurado de fechas, ubicación (enlazando a venue si existe), autor, aforo y costo de entrada,
 *   sección de evidencias adjuntas con enlaces seguros, y tarjetas de edición y cancelación si el usuario cuenta con los permisos requeridos.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el componente central de la ruta dinámica `/events/[id]`. Conecta con los contenedores de `events`, `zone` y `auth`.
 *
 * - **¿Cuál es su importancia?**:
 *   Ofrece la visión completa y transparente del evento para la ciudadanía, manteniendo la seguridad al restringir eventos privados y acciones administrativas.
 */
export async function EventDetail({ eventId }: { eventId: Promise<string> }) {
  const id = await eventId;

  let event: EventDetailData;
  try {
    event = await eventContainer.getEventUseCase.execute(id);
  } catch (error) {
    if (error instanceof EventNotFoundError) notFound();
    if (error instanceof EventPrivateError) return <Alert tone="warning">{error.message}</Alert>;
    // Cualquier otro fallo lo muestra error.tsx
    throw error;
  }

  const user = await getCurrentUser();
  const canEdit = canEditEvent(user, event);
  const canCancel = canCancelEvent(user, event);
  // Las zonas solo hacen falta para el formulario de edición
  const zones = canEdit ? await zoneContainer.listZonesUseCase.execute().catch(() => []) : [];
  const official = event.origin === EventOrigin.OFICIAL;
  // A un evento cancelado o rechazado ya no se responde
  const open = event.status !== EventStatus.CANCELADO && event.status !== EventStatus.RECHAZADO;
  const addEvidence = canAddEvidence(user, event);
  const review = event.status === EventStatus.REPORTADO && canModerateEvents(user);

  return (
    <>
      <Breadcrumbs items={[{ label: "Eventos", href: "/events" }, { label: event.title }]} />
      <PageHeader
        eyebrow={
          <Link href={`/zones/${event.zone.id}`} className="hover:underline">
            {event.zone.name}
          </Link>
        }
        title={
          // Pareja del título de la tarjeta del listado (event-card.tsx)
          <ViewTransition name={`event-title-${event.id}`} share="morph" default="none">
            <span className="inline-block">{event.title}</span>
          </ViewTransition>
        }
        description={event.description ?? undefined}
        actions={
          <>
            <EventStatusBadge status={event.status} />
            <Badge tone={official ? "info" : "neutral"}>{official ? "Oficial" : "Reporte ciudadano"}</Badge>
          </>
        }
        className="pt-2 pb-0"
      />

      {event.status === EventStatus.CANCELADO && <Alert tone="warning">Este evento fue cancelado.</Alert>}
      {event.status === EventStatus.RECHAZADO && (
        <Alert tone="danger" title="Reporte rechazado">
          {event.rejectionReason ?? "Un administrador rechazó este reporte."}
        </Alert>
      )}
      {event.status === EventStatus.REPORTADO &&
        (addEvidence && event.evidences.length === 0 ? (
          <Alert tone="warning" title="Falta la evidencia">
            Adjunta al menos una evidencia: sin ella, ningún administrador puede confirmar el reporte.
          </Alert>
        ) : (
          <Alert tone="info">Este reporte está en revisión: un administrador lo confirmará con las evidencias.</Alert>
        ))}

      <Card>
        <CardBody>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="font-semibold text-ink-muted">Empieza</dt>
              <dd className="text-ink">{formatDateTime(event.startDate)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">Termina</dt>
              <dd className="text-ink">{formatDateTime(event.endDate)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">Dónde</dt>
              <dd className="text-ink">
                {event.venue ? (
                  <Link href={`/venues/${event.venue.id}`} className="text-primary-strong hover:underline">
                    {event.venue.name}
                  </Link>
                ) : (
                  (event.addressText ?? "Sin dirección")
                )}
              </dd>
              {event.venue && event.addressText && <dd className="text-ink-muted">{event.addressText}</dd>}
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">{official ? "Publicado por" : "Reportado por"}</dt>
              <dd className="text-ink">
                {event.createdBy.fullName} <span className="text-ink-muted">@{event.createdBy.username}</span>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink-muted">Asistirán</dt>
              <dd className="text-ink">
                {event.attendeeCount}
                {event.capacity !== null && <span className="text-ink-muted"> de {event.capacity}</span>}
              </dd>
            </div>
            {event.ticketPrice !== null && (
              <div>
                <dt className="font-semibold text-ink-muted">Entrada</dt>
                <dd className="text-ink">{event.ticketPrice === 0 ? "Gratis" : priceFormat.format(event.ticketPrice)}</dd>
              </div>
            )}
          </dl>
        </CardBody>
      </Card>

      {event.evidences.length > 0 && (
        <Card>
          <CardHeader title="Evidencias" description="Lo que adjuntó su autor para que se pueda verificar." />
          <CardBody>
            <EvidenceList evidences={event.evidences} />
          </CardBody>
        </Card>
      )}

      {(review || addEvidence) && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {review && (
            <Card>
              <CardHeader
                title="Revisar reporte"
                description="Confírmalo si las evidencias lo respaldan; si no, recházalo con un motivo."
              />
              <CardBody>
                <ReviewReportPanel eventId={event.id} />
              </CardBody>
            </Card>
          )}
          {addEvidence && (
            <Card>
              <CardHeader title="Adjuntar evidencia" description="Fotos, enlaces o documentos que prueben el evento." />
              <CardBody>
                <EvidenceForm eventId={event.id} />
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {user && open && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <EventAttendance eventId={event.id} showAttendees={canSeeAttendees(user, event)} />
          <InviteFriends eventId={event.id} />
        </div>
      )}

      {(canEdit || canCancel) && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {canEdit && (
            <Card>
              <CardHeader title="Editar reporte" description="Solo se puede editar mientras está en revisión." />
              <CardBody>
                <EventForm event={event} zones={zones} />
              </CardBody>
            </Card>
          )}
          {canCancel && (
            <Card>
              <CardHeader title="Cancelar evento" description="El evento se conserva, marcado como cancelado." />
              <CardBody>
                <CancelEventButton eventId={event.id} eventTitle={event.title} />
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
