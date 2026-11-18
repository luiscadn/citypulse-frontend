/**
 * Valores del Formulario de Zonas (ZoneFormValues)
 *
 * - **¿Qué hace?**: Modela los valores ingresados por el usuario como cadenas de texto en los campos de entrada:
 *   `name`, `description` y `parentZoneId` (`""` representa la ausencia de zona contenedora).
 * - **¿Cómo interactúa con el sistema en general?**: Es el estado de entrada preservado durante envíos de formulario con `useActionState`.
 * - **¿Cuál es su importancia?**: Permite re-poblar los campos con lo que el usuario escribió si la acción falla por un error de validación.
 */
export interface ZoneFormValues {
  name: string;
  description: string;
  /** "" = sin zona padre */
  parentZoneId: string;
}

/** Mapeo de errores de validación indexados por el nombre de cada campo del formulario */
export type ZoneFieldErrors = Partial<Record<keyof ZoneFormValues, string>>;

/**
 * Estado de Formulario ZoneFormState (Patrón Action State de React 19)
 *
 * - **¿Qué hace?**: Encapsula el estado completo retornado por las Server Actions de zonas:
 *   valores actuales (`values`), errores específicos por campo (`errors`), error general opcional (`error`)
 *   y mensaje de confirmación exitosa (`success`).
 * - **¿Cómo interactúa con el sistema en general?**: Se enlaza con `useActionState` en `ZoneForm`.
 * - **¿Cuál es su importancia?**: Facilita la comunicación bidireccional entre Server Actions y Client Components
 *   sin depender de estados locales dispersos ni hooks externos de formulario.
 */
export interface ZoneFormState {
  values: ZoneFormValues;
  errors: ZoneFieldErrors;
  /** Error general, no ligado a un campo */
  error?: string;
  success?: string;
}

/** Valores iniciales por defecto para un formulario de zona en blanco */
export const emptyZoneFormValues: ZoneFormValues = { name: "", description: "", parentZoneId: "" };

/**
 * Función initialZoneFormState
 *
 * - **¿Qué hace?**: Genera un `ZoneFormState` limpio con valores iniciales y sin errores.
 * - **¿Cómo interactúa con el sistema en general?**: Inicializa el hook `useActionState` en `ZoneForm`.
 * - **¿Cuál es su importancia?**: Estandariza la inicialización de estados tanto en modo creación como en edición.
 */
export function initialZoneFormState(values: ZoneFormValues = emptyZoneFormValues): ZoneFormState {
  return { values, errors: {} };
}

/** Estado de retorno para la acción de eliminación de zona */
export interface DeleteZoneState {
  error?: string;
}
