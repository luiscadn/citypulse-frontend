/** Lo que escribió la persona en el formulario de zona, como texto. */
export interface ZoneFormValues {
  name: string;
  description: string;
  /** "" = sin zona padre */
  parentZoneId: string;
}

export type ZoneFieldErrors = Partial<Record<keyof ZoneFormValues, string>>;

/** Estado de los formularios de zona (useActionState). */
export interface ZoneFormState {
  values: ZoneFormValues;
  errors: ZoneFieldErrors;
  /** Error general, no ligado a un campo */
  error?: string;
  success?: string;
}

export const emptyZoneFormValues: ZoneFormValues = { name: "", description: "", parentZoneId: "" };

export function initialZoneFormState(values: ZoneFormValues = emptyZoneFormValues): ZoneFormState {
  return { values, errors: {} };
}

/** Estado del botón de borrar zona. */
export interface DeleteZoneState {
  error?: string;
}
