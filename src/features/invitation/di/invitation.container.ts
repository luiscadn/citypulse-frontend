import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { GetPendingInvitationsUseCase } from "../application/use-cases/get-pending-invitations.use-case";
import { RespondInvitationUseCase } from "../application/use-cases/respond-invitation.use-case";
import { SendInvitationUseCase } from "../application/use-cases/send-invitation.use-case";
import { HttpInvitationRepository } from "../infrastructure/repositories/http-invitation-repository";

/** Arma los casos de uso de invitaciones con sus implementaciones concretas. */
const invitationRepository = new HttpInvitationRepository(serverHttp);

export const invitationContainer = {
  getPendingInvitationsUseCase: new GetPendingInvitationsUseCase(invitationRepository),
  sendInvitationUseCase: new SendInvitationUseCase(invitationRepository),
  respondInvitationUseCase: new RespondInvitationUseCase(invitationRepository),
};
