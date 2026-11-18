/**
 * @file venue-form-state.ts
 * @description Tipos y estados auxiliares para los formularios y acciones de Lugares (Venues).
 * Diseñados para integrarse fluidamente con el hook `useActionState` de React 19.
 */

/**
 * Representa los valores textuales ingresados por el usuario en el formulario de Lugar.
 *
 * - **¿Qué hace?**: Estructura como strings los campos del formulario: nombre, dirección, descripción y zona seleccionada.
 * - **¿Cómo interactúa con el sistema en general?**: Mantiene el estado controlado o no controlado de los inputs en `VenueForm`.
 * - **¿Cuál es su importancia?**: Permite preservar lo que el usuario escribió si la validación falla, evitando que tenga que reescribir todo.
 */
export interface VenueFormValues {
  name: string;
  address: string;
  description: string;
  /** Identificador de zona en formato string ("" = sin selección). */
  zoneId: string;
}

/**
 * Diccionario de errores específicos mapeados a cada campo del formulario.
 */
export type VenueFieldErrors = Partial<Record<keyof VenueFormValues, string>>;

/**
 * Estado general del formulario devuelto por las Server Actions de creación y actualización.
 *
 * - **¿Qué hace?**: Agrupa los valores del formulario (`values`), errores por campo (`errors`), error general (`error`) y mensaje de éxito (`success`).
 * - **¿Cómo interactúa con el sistema en general?**: Es el valor de retorno de `createVenueAction` y `updateVenueAction`, consumido por `useActionState` en `VenueForm`.
 * - **¿Cuál es su importancia?**: Provee una interfaz unificada y accesible para renderizar alertas y mensajes de validación inline.
 */
export interface VenueFormState {
  values: VenueFormValues;
  errors: VenueFieldErrors;
  /** Mensaje de error global no asociado a un campo específico. */
  error?: string;
  /** Mensaje de éxito tras una operación completada. */
  success?: string;
}

/**
 * Valores iniciales vacíos para el formulario de alta de un lugar.
 */
export const emptyVenueFormValues: VenueFormValues = { name: "", address: "", description: "", zoneId: "" };

/**
 * Genera el estado inicial para el formulario de lugar.
 *
 * - **¿Qué hace?**: Retorna un objeto `VenueFormState` limpio con los valores proporcionados o vacíos y sin errores.
 * - **¿Cómo interactúa con el sistema en general?**: Usado como segundo argumento de `useActionState` en `VenueForm`.
 * - **¿Cuál es su importancia?**: Simplifica la inicialización del estado del formulario tanto en modo creación como en edición.
 */
export function initialVenueFormState(values: VenueFormValues = emptyVenueFormValues): VenueFormState {
  return { values, errors: {} };
}

/**
 * Estado para las acciones puntuales que no manejan formularios de texto complejos (como borrar o verificar).
 *
 * - **¿Qué hace?**: Contiene únicamente una propiedad opcional `error`.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado por `deleteVenueAction` y `verifyVenueAction` junto a `useActionState`.
 * - **¿Cuál es su importancia?**: Permite notificar fallos en botones de acción sin sobrecargar la estructura de datos.
 */
export interface VenueActionState {
  error?: string;
}
