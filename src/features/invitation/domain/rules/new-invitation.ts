import type { NewInvitation } from "../entities/invitation";
import {
  InvalidInvitationEventError,
  InvalidInvitationTargetError,
  InvitationMessageTooLongError,
  SelfInvitationError,
} from "../errors/invitation-errors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MESSAGE_MAX_LENGTH = 255;

/**
 * Función prepareNewInvitation: Validación y saneamiento de invitaciones a eventos.
 *
 * - **¿Qué hace?**: Comprueba que el `eventId` sea un UUID v4, que `toUserId` sea un entero positivo,
 *   que el usuario no se invite a sí mismo (`toUserId === currentUserId`), y que el mensaje opcional
 *   no exceda 255 caracteres, eliminando espacios redundantes (`trim`).
 * - **¿Cómo interactúa con el sistema en general?**: Es invocada por `SendInvitationUseCase` antes de llamar al repositorio.
 * - **¿Cuál es su importancia?**: Falla de forma temprana ante datos incoherentes, evitando peticiones de red inválidas.
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
  if (message && message.length > MESSAGE_MAX_LENGTH) {
    throw new InvitationMessageTooLongError();
  }
  return message ? { eventId, toUserId, message } : { eventId, toUserId };
}
