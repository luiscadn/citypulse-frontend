import type { PendingInvitation } from "../../domain/entities/invitation";
import type { InvitationRepository } from "../repositories/invitation-repository";

/**
 * Caso de Uso: GetPendingInvitationsUseCase
 *
 * - **¿Qué hace?**: Recupera todas las invitaciones a eventos que el usuario autenticado ha recibido y que siguen pendientes de respuesta.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde `InvitationsPage` a través de `invitationContainer`,
 *   suministrando la promesa al contexto `InvitationProvider`.
 * - **¿Cuál es su importancia?**: Centraliza la consulta de la bandeja de entrada de invitaciones del usuario.
 */
export class GetPendingInvitationsUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  /**
   * Ejecuta la consulta de invitaciones pendientes.
   *
   * @returns Lista inmutable de invitaciones pendientes.
   */
  execute(): Promise<readonly PendingInvitation[]> {
    return this.invitationRepository.getPending();
  }
}
