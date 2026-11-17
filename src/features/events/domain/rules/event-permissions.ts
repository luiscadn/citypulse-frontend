import { EventStatus, RoleName } from "@/shared/domain/enums";
import type { Event } from "../entities/event";

/**
 * Réplica UX (no autoritativa) de EventsController y EventsService.
 * Sirve para mostrar u ocultar botones; si difieren, el backend gana.
 */
type Requester = { id: number; roles: readonly RoleName[] } | null;

const isAdmin = (user: Requester) => user?.roles.includes(RoleName.ADMIN) ?? false;

const isAuthorOrAdmin = (user: Requester, event: Pick<Event, "createdBy">) =>
  !!user && (event.createdBy.id === user.id || isAdmin(user));

/** RF-3.1: cualquier usuario con sesión puede reportar un evento. */
export function canReportEvents(user: Requester): boolean {
  return user !== null;
}

/** RF-3.5: el autor (o un ADMIN) edita un reporte solo mientras esté en REPORTADO. */
export function canEditEvent(user: Requester, event: Pick<Event, "createdBy" | "status">): boolean {
  return event.status === EventStatus.REPORTADO && isAuthorOrAdmin(user, event);
}

/** RF-5.6: el autor (o un ADMIN) cancela un evento que no esté ya cancelado. */
export function canCancelEvent(user: Requester, event: Pick<Event, "createdBy" | "status">): boolean {
  return event.status !== EventStatus.CANCELADO && isAuthorOrAdmin(user, event);
}

/** RF-5.7: solo el autor (o un ADMIN) ve la lista completa de quienes respondieron. */
export function canSeeAttendees(user: Requester, event: Pick<Event, "createdBy">): boolean {
  return isAuthorOrAdmin(user, event);
}
