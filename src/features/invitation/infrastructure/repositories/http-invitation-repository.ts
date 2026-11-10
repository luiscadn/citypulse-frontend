import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { InvitationRepository } from "../../application/repositories/invitation-repository";
import type {
  InvitationAnswer,
  NewInvitation,
  PendingInvitation,
} from "../../domain/entities/invitation";
import {
  InvitationAlreadyAnsweredError,
  InvitationAlreadyExistsError,
  InvitationEventNotFoundError,
  InvitationForbiddenError,
  InvitationNotAllowedError,
  InvitationNotFoundError,
} from "../../domain/errors/invitation-errors";
import type { PendingInvitationDto } from "../dtos/invitation.dto";
import { toPendingInvitation } from "../mappers/invitation.mapper";

export class HttpInvitationRepository implements InvitationRepository {
  constructor(private readonly http: HttpClient) {}

  async getPending(): Promise<readonly PendingInvitation[]> {
    const dtos = await this.http.get<PendingInvitationDto[]>("/invitations/pending");
    return dtos.map(toPendingInvitation);
  }

  async send(invitation: NewInvitation): Promise<void> {
    try {
      await this.http.post("/invitations", invitation);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 403) throw new InvitationNotAllowedError();
        if (error.status === 404) throw new InvitationEventNotFoundError();
        if (error.status === 409) throw new InvitationAlreadyExistsError();
      }
      throw error;
    }
  }

  async respond(invitationId: number, answer: InvitationAnswer): Promise<void> {
    try {
      await this.http.patch(`/invitations/${invitationId}`, { status: answer });
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 400) throw new InvitationAlreadyAnsweredError();
        if (error.status === 403) throw new InvitationForbiddenError();
        if (error.status === 404) throw new InvitationNotFoundError();
      }
      throw error;
    }
  }
}
