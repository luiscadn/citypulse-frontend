/** Lo que escribió la persona en el formulario de evento, como texto. */
export interface EventFormValues {
  title: string;
  description: string;
  /** "" = sin elegir */
  zoneId: string;
  addressText: string;
  /** "2026-10-01T09:00", hora de Colombia (como lo entrega <input type="datetime-local">) */
  startDate: string;
  endDate: string;
}

export type EventFieldErrors = Partial<Record<keyof EventFormValues, string>>;

/** Estado de los formularios de evento (useActionState). */
export interface EventFormState {
  values: EventFormValues;
  errors: EventFieldErrors;
  /** Error general, no ligado a un campo */
  error?: string;
  success?: string;
}

export const emptyEventFormValues: EventFormValues = {
  title: "",
  description: "",
  zoneId: "",
  addressText: "",
  startDate: "",
  endDate: "",
};

export function initialEventFormState(values: EventFormValues = emptyEventFormValues): EventFormState {
  return { values, errors: {} };
}

/** Estado del botón de cancelar. */
export interface EventActionState {
  error?: string;
}
