/** Lo que la UI muestra de quien invita. Sin correo ni datos internos de la cuenta. */
export interface InvitationSender {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/** Lo que la bandeja muestra del evento. Las fechas van en formato ISO, como las envía el backend. */
export interface InvitationEvent {
  readonly id: string;
  readonly title: string;
  readonly startDate: string;
  readonly endDate: string;
}

/** Invitación que recibí y sigue sin respuesta. */
export interface PendingInvitation {
  readonly id: number;
  readonly event: InvitationEvent;
  readonly from: InvitationSender;
  readonly message: string | null;
}

/** Datos para invitar a un amigo a un evento. */
export interface NewInvitation {
  readonly eventId: string;
  readonly toUserId: number;
  readonly message?: string;
}

/** Respuestas posibles a una invitación recibida (mismos valores que el backend). */
export type InvitationAnswer = "ACEPTADA" | "RECHAZADA";
