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

/** Formulario de evento oficial: lo del reporte (sin zona, que sale del lugar) más estos campos. */
export interface OfficialEventFormValues extends Omit<EventFormValues, "zoneId"> {
  /** "" = sin elegir */
  venueId: string;
  visibility: string;
  /** "" = sin límite */
  capacity: string;
  /** "" = sin precio definido */
  ticketPrice: string;
}

export type OfficialEventFieldErrors = Partial<Record<keyof OfficialEventFormValues, string>>;

export interface OfficialEventFormState {
  values: OfficialEventFormValues;
  errors: OfficialEventFieldErrors;
  error?: string;
}

export const emptyOfficialEventFormValues: OfficialEventFormValues = {
  title: "",
  description: "",
  addressText: "",
  startDate: "",
  endDate: "",
  venueId: "",
  visibility: "PUBLICO",
  capacity: "",
  ticketPrice: "",
};

/** Formulario para adjuntar una evidencia. */
export interface EvidenceFormValues {
  type: string;
  url: string;
  caption: string;
}

export interface EvidenceFormState {
  values: EvidenceFormValues;
  errors: Partial<Record<keyof EvidenceFormValues, string>>;
  error?: string;
  success?: string;
}

export const emptyEvidenceFormValues: EvidenceFormValues = { type: "FOTO", url: "", caption: "" };

/** Formulario para rechazar un reporte. */
export interface RejectReportState {
  reason: string;
  error?: string;
}
