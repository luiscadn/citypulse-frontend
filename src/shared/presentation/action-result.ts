/** Resultado de una Server Action que no es un formulario (se llama desde un botón). */
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };