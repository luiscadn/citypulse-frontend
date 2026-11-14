/** Lo que escribió la persona en el formulario de lugar, como texto. */
export interface VenueFormValues {
  name: string;
  address: string;
  description: string;
  /** "" = sin elegir */
  zoneId: string;
}

export type VenueFieldErrors = Partial<Record<keyof VenueFormValues, string>>;

/** Estado de los formularios de lugar (useActionState). */
export interface VenueFormState {
  values: VenueFormValues;
  errors: VenueFieldErrors;
  /** Error general, no ligado a un campo */
  error?: string;
  success?: string;
}

export const emptyVenueFormValues: VenueFormValues = { name: "", address: "", description: "", zoneId: "" };

export function initialVenueFormState(values: VenueFormValues = emptyVenueFormValues): VenueFormState {
  return { values, errors: {} };
}

/** Estado de los botones de borrar y verificar. */
export interface VenueActionState {
  error?: string;
}
