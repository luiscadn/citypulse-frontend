import type {
  InvitationAnswer,
  NewInvitation,
  PendingInvitation,
} from "../../domain/entities/invitation";

/** Puerto: lo que la aplicación necesita del backend para manejar invitaciones. */
export interface InvitationRepository {
  getPending(): Promise<readonly PendingInvitation[]>;
  send(invitation: NewInvitation): Promise<void>;
  respond(invitationId: number, answer: InvitationAnswer): Promise<void>;
}
