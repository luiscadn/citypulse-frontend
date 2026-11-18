"use client";

import { Card, CardHeader, EmptyState } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { useInvitations } from "../hooks/use-invitations";
import { InvitationAnswerActions } from "./invitation-answer-actions";

/**
 * Componente InvitationInbox: Bandeja de entrada visual de invitaciones pendientes.
 *
 * - **¿Qué hace?**: Obtiene la lista de invitaciones pendientes mediante `useInvitations()`.
 *   Si la lista está vacía, renderiza `EmptyState` informando que no hay invitaciones pendientes.
 *   Si contiene invitaciones, renderiza una tarjeta `Card` con una lista dividida donde cada ítem muestra
 *   el título del evento, la fecha formateada en horario de Bogotá, el nombre y usuario del remitente,
 *   el mensaje personalizado si existe, y los botones interactivos `InvitationAnswerActions`.
 * - **¿Cómo interactúa con el sistema en general?**: Se monta en `InvitationsPage` dentro de `<Suspense>`.
 * - **¿Cuál es su importancia?**: Centraliza la experiencia de usuario para la interacción y recepción
 *   de eventos compartidos por amigos en la comunidad de CityPulse.
 */
export function InvitationInbox() {
  const { pending } = useInvitations();

  if (pending.length === 0) {
    return (
      <EmptyState
        title="No tienes invitaciones pendientes"
        description="Cuando un amigo te invite a un evento, aparecerá aquí."
      />
    );
  }

  return (
    <Card>
      <CardHeader title="Invitaciones pendientes" description="Tus amigos quieren que los acompañes." />
      <ul className="divide-y divide-line">
        {pending.map((invitation) => (
          <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{invitation.event.title}</p>
              <p className="text-sm text-ink-muted">{formatDateTime(invitation.event.startDate)}</p>
              <p className="text-sm text-ink-muted">
                Te invita {invitation.from.fullName} (@{invitation.from.username})
              </p>
              {invitation.message && <p className="mt-1 text-sm text-ink">{invitation.message}</p>}
            </div>
            <InvitationAnswerActions invitationId={invitation.id} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
