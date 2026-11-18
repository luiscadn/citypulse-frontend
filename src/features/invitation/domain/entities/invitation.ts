/**
 * Entidad InvitationSender: Representación del remitente de una invitación.
 *
 * - **¿Qué hace?**: Modela los datos públicos de la persona que envía la invitación (`id`, `username`, `fullName`).
 * - **¿Cómo interactúa con el sistema en general?**: Se compone dentro de `PendingInvitation` para mostrar
 *   quién realizó la invitación en el buzón `InvitationInbox`.
 * - **¿Cuál es su importancia?**: Oculta detalles privados de la cuenta (como correo o roles) preservando la privacidad del usuario.
 */
export interface InvitationSender {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/**
 * Entidad InvitationEvent: Resumen del evento al que se invita.
 *
 * - **¿Qué hace?**: Encapsula los datos esenciales del evento (`id` UUID, `title`, `startDate` y `endDate`).
 * - **¿Cómo interactúa con el sistema en general?**: Se incluye dentro de `PendingInvitation`.
 * - **¿Cuál es su importancia?**: Permite que el receptor identifique la fecha y título del evento sin cargar la entidad completa `Event`.
 */
export interface InvitationEvent {
  readonly id: string;
  readonly title: string;
  readonly startDate: string;
  readonly endDate: string;
}

/**
 * Entidad PendingInvitation: Invitación pendiente de respuesta.
 *
 * - **¿Qué hace?**: Modela una invitación activa recibida por el usuario que aún no ha sido aceptada ni rechazada,
 *   incluyendo el evento asociado (`event`), el remitente (`from`) y una nota opcional (`message`).
 * - **¿Cómo interactúa con el sistema en general?**: Es el tipo retornado por `GetPendingInvitationsUseCase`
 *   y renderizado en `InvitationInbox`.
 * - **¿Cuál es su importancia?**: Representa el estado pendiente en el ciclo de vida de una invitación social.
 */
export interface PendingInvitation {
  readonly id: number;
  readonly event: InvitationEvent;
  readonly from: InvitationSender;
  readonly message: string | null;
}

/**
 * Value Object NewInvitation: Estructura de datos para enviar una invitación.
 *
 * - **¿Qué hace?**: Agrupa el identificador del evento (`eventId`), el destinatario (`toUserId`) y el mensaje opcional (`message`).
 * - **¿Cómo interactúa con el sistema en general?**: Se valida con `prepareNewInvitation` y es consumida por `SendInvitationUseCase`.
 * - **¿Cuál es su importancia?**: Estandariza la entrada de datos para la creación de invitaciones entre amigos.
 */
export interface NewInvitation {
  readonly eventId: string;
  readonly toUserId: number;
  readonly message?: string;
}

/**
 * Tipo InvitationAnswer: Respuestas posibles a una invitación.
 *
 * - **¿Qué hace?**: Restringe los estados de respuesta a `"ACEPTADA"` o `"RECHAZADA"`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada por `RespondInvitationUseCase` y `respondInvitationAction`.
 * - **¿Cuál es su importancia?**: Asegura coincidencia exacta con el backend para la resolución de invitaciones.
 */
export type InvitationAnswer = "ACEPTADA" | "RECHAZADA";
