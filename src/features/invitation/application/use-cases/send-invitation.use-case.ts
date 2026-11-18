import type { NewInvitation } from "../../domain/entities/invitation";
import { prepareNewInvitation } from "../../domain/rules/new-invitation";
import type { InvitationRepository } from "../repositories/invitation-repository";

/**
 * Caso de Uso: SendInvitationUseCase
 *
 * - **¿Qué hace?**: Envía una invitación para un evento a un amigo. Valida la invariante de no autoinvitarse
 *   y las restricciones de formato mediante `prepareNewInvitation` antes de solicitar la persistencia al repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta desde la Server Action `sendInvitationAction`
 *   en el bounded context de eventos.
 * - **¿Cuál es su importancia?**: Fomenta el crecimiento de la red social y la asistencia a eventos comunitarios
 *   bajo reglas estrictas de validación de amistades.
 */
export class SendInvitationUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  /**
   * Ejecuta el envío de una nueva invitación.
   *
   * @param currentUserId - Identificador del usuario que envía la invitación.
   * @param invitation - Datos de la invitación (evento, amigo destinatario, mensaje).
   */
  async execute(currentUserId: number, invitation: NewInvitation): Promise<void> {
    await this.invitationRepository.send(prepareNewInvitation(currentUserId, invitation));
  }
}
