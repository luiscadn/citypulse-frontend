"use client";

import { Card, CardHeader, EmptyState } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { useInvitations } from "../hooks/use-invitations";
import { InvitationAnswerActions } from "./invitation-answer-actions";

/**
 * Invitaciones pendientes del usuario de la sesión.
 * useInvitations() suspende hasta tenerlas: debe ir dentro de <Suspense>.
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
      <ul className="stagger divide-y divide-line">
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
