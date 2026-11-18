/**
 * Tipo ActionResult<T>
 *
 * - **¿Qué hace?**: Modela el resultado de una Server Action ejecutada desde un botón o evento interactivo
 *   (distinta de los formularios de `useActionState`). Es un tipo unión discriminada:
 *   - `{ ok: true; data: T }` en caso de éxito.
 *   - `{ ok: false; error: string }` en caso de error con el mensaje correspondiente.
 * - **¿Cómo interactúa con el sistema en general?**: Es el tipo de retorno devuelto por Server Actions puntuales
 *   como responder a invitaciones (`respondInvitationAction`), cancelar eventos (`cancelEventAction`),
 *   gestionar amistades (`respondFriendRequestAction`) y cambiar roles (`assignUserRolesAction`).
 * - **¿Cuál es su importancia?**: Implementa el patrón Result para manejo funcional y predecible de errores.
 *   Permite que los componentes clientes consuman Server Actions dentro de `startTransition` sin necesidad
 *   de bloques `try/catch` manuales, facilitando la actualización inmediata del estado y feedback visual.
 */
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };
