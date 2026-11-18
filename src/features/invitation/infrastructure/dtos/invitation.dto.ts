/**
 * DTO PendingInvitationDto (Data Transfer Object)
 *
 * - **¿Qué hace?**: Modela cada elemento devuelto por `GET /invitations/pending` en el backend NestJS.
 * - **¿Cómo interactúa con el sistema en general?**: Es recibido por `HttpInvitationRepository` y transformado
 *   por `toPendingInvitation` a la entidad `PendingInvitation`.
 * - **¿Cuál es su importancia?**: Aísla el modelo de dominio de los detalles de serialización y relaciones
 *   foráneas del backend.
 */
export interface PendingInvitationDto {
  id: number;
  message: string | null;
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  fromUser: {
    id: number;
    username: string;
    fullName: string;
  };
}
