/**
 * Estado InvitationActionState
 *
 * - **¿Qué hace?**: Modela el estado devuelto por las Server Actions de invitaciones (`respondInvitationAction`),
 *   conteniendo un mensaje de error opcional (`error`).
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza con `useActionState` en `useRespondInvitation`.
 * - **¿Cuál es su importancia?**: Proporciona una forma estándar y predecible de reflejar fallos en la interfaz sin romper el flujo de la aplicación.
 */
export interface InvitationActionState {
  error?: string;
  success?: string;
}

/** Estado inicial limpio para acciones de invitaciones */
export const initialInvitationActionState: InvitationActionState = {};
