/**
 * @file event-detail.tsx
 * @description Server Component para la vista de detalle de un Evento.
 * Integra metadatos, evidencias de respaldo, estado de moderación,
 * controles de edición para reportes en revisión y opción de cancelación.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { zoneContainer } from "@/features/zone/di/zone.container";
import { EventOrigin, EventStatus } from "@/shared/domain/enums";
import { Alert, Badge, Card, CardBody, CardHeader, PageHeader } from "@/shared/presentation/components";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { eventContainer } from "../../di/event.container";
import type { EventDetail as EventDetailData } from "../../domain/entities/event";
import { EventNotFoundError, EventPrivateError } from "../../domain/errors/event-errors";
import { canCancelEvent, canEditEvent } from "../../domain/rules/event-permissions";
import { CancelEventButton } from "./cancel-event-button";
import { EventForm } from "./event-form";
import { EventStatusBadge } from "./event-status-badge";

const EVIDENCE_LABELS = { FOTO: "Foto", ENLACE: "Enlace", DOCUMENTO: "Documento" } as const;

/**
 * Verifica si una URL tiene un protocolo seguro web (`http:` o `https:`).
 */
function isWebUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

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
    throw error;
  }

  const user = await getCurrentUser();
  const canEdit = canEditEvent(user, event);
  const canCancel = canCancelEvent(user, event);
  const zones = canEdit ? await zoneContainer.listZonesUseCase.execute().catch(() => []) : [];
  const official = event.origin === EventOrigin.OFICIAL;

  return (
    <>
      <Breadcrumbs items={[{ label: "Eventos", href: "/events" }, { label: event.title }]} />
      <PageHeader
        eyebrow={
          <Link href={`/zones/${event.zone.id}`} className="hover:underline">
            {event.zone.name}
          </Link>
        }
        title={event.title}
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
      {event.status === EventStatus.REPORTADO && (
        <Alert tone="info">Este reporte está en revisión: un administrador lo confirmará con las evidencias.</Alert>
      )}

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
            <ul className="flex flex-col gap-2 text-sm">
              {event.evidences.map((evidence) => (
                <li key={evidence.id} className="flex flex-wrap items-center gap-2">
                  <Badge>{EVIDENCE_LABELS[evidence.type]}</Badge>
                  {isWebUrl(evidence.url) ? (
                    <a
                      href={evidence.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-strong hover:underline"
                    >
                      {evidence.caption ?? evidence.url} ↗
                    </a>
                  ) : (
                    <span className="text-ink">{evidence.caption ?? evidence.url}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
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
