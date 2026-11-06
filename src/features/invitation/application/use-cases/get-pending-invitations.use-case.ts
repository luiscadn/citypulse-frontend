import type { PendingInvitation } from "../../domain/entities/invitation";
import type { InvitationRepository } from "../repositories/invitation-repository";

/** Trae las invitaciones que recibí y siguen sin respuesta. */
export class GetPendingInvitationsUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  execute(): Promise<readonly PendingInvitation[]> {
    return this.invitationRepository.getPending();
  }
}
