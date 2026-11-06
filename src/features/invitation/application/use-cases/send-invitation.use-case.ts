import type { NewInvitation } from "../../domain/entities/invitation";
import { prepareNewInvitation } from "../../domain/rules/new-invitation";
import type { InvitationRepository } from "../repositories/invitation-repository";

/** Invita a un amigo a un evento. */
export class SendInvitationUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  async execute(currentUserId: number, invitation: NewInvitation): Promise<void> {
    await this.invitationRepository.send(prepareNewInvitation(currentUserId, invitation));
  }
}
