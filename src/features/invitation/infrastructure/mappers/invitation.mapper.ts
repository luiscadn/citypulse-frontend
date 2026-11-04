import type { PendingInvitation } from "../../domain/entities/invitation";
import type { PendingInvitationDto } from "../dtos/invitation.dto";

/** Solo copia los campos de la entidad: lo demás que mande el backend no llega a la UI. */
export function toPendingInvitation(dto: PendingInvitationDto): PendingInvitation {
  return {
    id: dto.id,
    message: dto.message,
    event: {
      id: dto.event.id,
      title: dto.event.title,
      startDate: dto.event.startDate,
      endDate: dto.event.endDate,
    },
    from: {
      id: dto.fromUser.id,
      username: dto.fromUser.username,
      fullName: dto.fromUser.fullName,
    },
  };
}
