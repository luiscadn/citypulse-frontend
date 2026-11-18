/**
 * @file event-permissions.ts
 * @description Reglas de Dominio para calcular permisos y autorizaciones sobre Eventos.
 * Actúan como una réplica de conveniencia en UI (no autoritativa) para controlar la visibilidad
 * de acciones y botones en la interfaz de usuario.
 */

import { EventStatus, RoleName } from "@/shared/domain/enums";
import type { Event } from "../entities/event";

/**
 * Representa al usuario que realiza la consulta, conteniendo sus roles e identificador.
 */
type Requester = { id: number; roles: readonly RoleName[] } | null;

/**
 * Función interna para verificar si el usuario tiene rol de Administrador.
 */
const isAdmin = (user: Requester) => user?.roles.includes(RoleName.ADMIN) ?? false;

/**
 * Comprueba si el usuario es el autor legítimo del evento o si es un Administrador.
 */
const isAuthorOrAdmin = (user: Requester, event: Pick<Event, "createdBy">) =>
  !!user && (event.createdBy.id === user.id || isAdmin(user));

/**
 * Determina si el usuario tiene permiso para reportar eventos ciudadanos (Requisito Funcional RF-3.1).
 *
 * - **¿Qué hace?**: Comprueba que el usuario tenga una sesión activa (`user !== null`).
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `EventList` y `reportEventAction` para permitir el acceso al formulario de alta.
 * - **¿Cuál es su importancia?**: Promueve la participación comunitaria permitiendo a cualquier ciudadano autenticado reportar actividades locales.
 */
export function canReportEvents(user: Requester): boolean {
  return user !== null;
}

/**
 * Determina si el usuario puede editar un reporte de evento (Requisito Funcional RF-3.5).
 *
 * - **¿Qué hace?**: Verifica que el evento se encuentre en estado `REPORTADO` (en revisión) y que el usuario sea el autor o un administrador.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada en `EventDetail` para decidir si se renderiza el formulario de edición.
 * - **¿Cuál es su importancia?**: Una vez confirmado o rechazado por los moderadores, el evento se bloquea para evitar alteraciones no supervisadas.
 */
export function canEditEvent(user: Requester, event: Pick<Event, "createdBy" | "status">): boolean {
  return event.status === EventStatus.REPORTADO && isAuthorOrAdmin(user, event);
}

/**
 * Determina si el usuario tiene potestad para cancelar un evento (Requisito Funcional RF-5.6).
 *
 * - **¿Qué hace?**: Comprueba que el evento no esté cancelado previamente y que el usuario sea su autor o un administrador.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `EventDetail` para mostrar u ocultar el botón `CancelEventButton`.
 * - **¿Cuál es su importancia?**: Permite a los organizadores o autoridades desconvocar un evento manteniendo su registro histórico en la plataforma.
 */
export function canCancelEvent(user: Requester, event: Pick<Event, "createdBy" | "status">): boolean {
  return event.status !== EventStatus.CANCELADO && isAuthorOrAdmin(user, event);
}
