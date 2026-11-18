import type {
  InvitationAnswer,
  NewInvitation,
  PendingInvitation,
} from "../../domain/entities/invitation";

/**
 * Puerto InvitationRepository (Arquitectura Hexagonal / Limpia)
 *
 * - **¿Qué hace?**: Declara los contratos de persistencia y operaciones remotas para invitaciones:
 *   obtener invitaciones pendientes recibidas (`getPending`), enviar invitación (`send`),
 *   y responder invitación (`respond`).
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Su implementación
 *   concreta es `HttpInvitationRepository`.
 * - **¿Cuál es su importancia?**: Cumple con el Principio de Inversión de Dependencias (DIP), permitiendo
 *   probar los casos de uso con implementaciones simuladas (mocks) sin requerir el backend activo.
 */
export interface InvitationRepository {
  getPending(): Promise<readonly PendingInvitation[]>;
  send(invitation: NewInvitation): Promise<void>;
  respond(invitationId: number, answer: InvitationAnswer): Promise<void>;
}
