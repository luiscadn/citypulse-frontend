import type { PendingInvitation } from "../../domain/entities/invitation";
import type { PendingInvitationDto } from "../dtos/invitation.dto";

/**
 * Función toPendingInvitation (Mapper DTO -> Entidad de Dominio)
 *
 * - **¿Qué hace?**: Mapea un `PendingInvitationDto` a la entidad `PendingInvitation`, renombrando `fromUser` a `from`
 *   y estructurando los datos del evento asociado.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `HttpInvitationRepository.getPending`.
 * - **¿Cuál es su importancia?**: Asegura que la capa de aplicación reciba entidades de dominio inmutables y consistentes.
 */
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
