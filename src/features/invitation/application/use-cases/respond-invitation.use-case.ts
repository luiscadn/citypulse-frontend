import type { InvitationAnswer } from "../../domain/entities/invitation";
import type { InvitationRepository } from "../repositories/invitation-repository";

/**
 * Caso de Uso: RespondInvitationUseCase
 *
 * - **¿Qué hace?**: Procesa la respuesta de una invitación (`"ACEPTADA"` o `"RECHAZADA"`), delegando la actualización al repositorio.
 * - **¿Cómo interactúa con el sistema en general?**: Es invocado por la Server Action `respondInvitationAction`.
 * - **¿Cuál es su importancia?**: Orquesta la aceptación o rechazo formal de invitaciones, permitiendo que al aceptar
 *   se actualice también el registro de asistencia del evento en el backend.
 */
export class RespondInvitationUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  /**
   * Ejecuta la respuesta a una invitación.
   *
   * @param invitationId - Identificador numérico de la invitación.
   * @param answer - "ACEPTADA" o "RECHAZADA".
   */
  execute(invitationId: number, answer: InvitationAnswer): Promise<void> {
    return this.invitationRepository.respond(invitationId, answer);
  }
}
