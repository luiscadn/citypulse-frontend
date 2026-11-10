import type { InvitationAnswer } from "../../domain/entities/invitation";
import type { InvitationRepository } from "../repositories/invitation-repository";

/** Acepta o rechaza una invitación recibida. */
export class RespondInvitationUseCase {
  constructor(private readonly invitationRepository: InvitationRepository) {}

  execute(invitationId: number, answer: InvitationAnswer): Promise<void> {
    return this.invitationRepository.respond(invitationId, answer);
  }
}
