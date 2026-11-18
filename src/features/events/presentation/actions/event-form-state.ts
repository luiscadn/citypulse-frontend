/**
 * @file event-form-state.ts
 * @description Tipos y estados auxiliares para los formularios y acciones de Eventos.
 * Diseñados para la integración con `useActionState` de React 19.
 */

/**
 * Representa los valores textuales de los campos del formulario de Evento.
 *
 * - **¿Qué hace?**: Estructura como strings: título, descripción, zona, dirección libre y fechas en formato local ("YYYY-MM-DDTHH:mm").
 * - **¿Cómo interactúa con el sistema en general?**: Mantiene el estado de los inputs en `EventForm`.
 * - **¿Cuál es su importancia?**: Preserva la información escrita por el usuario ante fallos de validación.
 */
export interface EventFormValues {
  title: string;
  description: string;
  /** Identificador de zona como string ("" = sin selección). */
  zoneId: string;
  addressText: string;
  /** Cadena "YYYY-MM-DDTHH:mm" en hora local de Colombia entregada por `<input type="datetime-local">`. */
  startDate: string;
  endDate: string;
}

/**
 * Diccionario de errores específicos mapeados a cada campo del formulario de eventos.
 */
export type EventFieldErrors = Partial<Record<keyof EventFormValues, string>>;

/**
 * Estado general del formulario devuelto por las Server Actions de reporte y actualización.
 *
 * - **¿Qué hace?**: Agrupa los valores actuales, errores por campo, error general y mensaje de éxito.
 * - **¿Cómo interactúa con el sistema en general?**: Retornado por `reportEventAction` y `updateEventAction` a `useActionState`.
 * - **¿Cuál es su importancia?**: Provee una interfaz unificada para la renderización de feedback accesible e inmediato.
 */
export interface EventFormState {
  values: EventFormValues;
  errors: EventFieldErrors;
  /** Mensaje de error no asociado a un campo en particular. */
  error?: string;
  /** Mensaje de confirmación de éxito. */
  success?: string;
}

/**
 * Valores vacíos por defecto para inicializar el formulario de reporte de eventos.
 */
export const emptyEventFormValues: EventFormValues = {
  title: "",
  description: "",
  zoneId: "",
  addressText: "",
  startDate: "",
  endDate: "",
};

/**
 * Genera el estado inicial limpio para el formulario de evento.
 */
export function initialEventFormState(values: EventFormValues = emptyEventFormValues): EventFormState {
  return { values, errors: {} };
}

/**
 * Estado para acciones puntuales sobre eventos (como la acción de cancelar).
 */
export interface EventActionState {
  error?: string;
}
