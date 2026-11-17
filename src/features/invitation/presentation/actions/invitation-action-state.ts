/** Estado que devuelven las acciones de invitaciones (useActionState). */
export interface InvitationActionState {
  error?: string;
  success?: string;
}

export const initialInvitationActionState: InvitationActionState = {};
