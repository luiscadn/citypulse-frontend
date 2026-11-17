import type { NewInvitation } from "../entities/invitation";
import {
  InvalidInvitationEventError,
  InvalidInvitationTargetError,
  InvitationMessageTooLongError,
  SelfInvitationError,
} from "../errors/invitation-errors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Mismo límite que el mensaje de CreateInvitationDto del backend. */
export const INVITATION_MESSAGE_MAX_LENGTH = 255;

/**
 * Réplica UX de las validaciones del backend: evita una petición que ya se sabe
 * que va a fallar. Si difieren, el backend gana. Un mensaje en blanco es lo mismo
 * que no enviar mensaje.
 */
export function prepareNewInvitation(currentUserId: number, invitation: NewInvitation): NewInvitation {
  const { eventId, toUserId } = invitation;
  if (!UUID.test(eventId)) {
    throw new InvalidInvitationEventError();
  }
  if (!Number.isInteger(toUserId) || toUserId <= 0) {
    throw new InvalidInvitationTargetError();
  }
  if (toUserId === currentUserId) {
    throw new SelfInvitationError();
  }

  const message = invitation.message?.trim();
  if (message && message.length > INVITATION_MESSAGE_MAX_LENGTH) {
    throw new InvitationMessageTooLongError();
  }
  return message ? { eventId, toUserId, message } : { eventId, toUserId };
}
