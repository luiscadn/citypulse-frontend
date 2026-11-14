/** Zona de la ciudad (barrio, comuna...). Los lugares y los eventos pertenecen a una. */
export interface Zone {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  /** Zona que la contiene. null si es una zona raíz o si el backend no la envía. */
  readonly parentId: number | null;
  /** Fecha ISO de creación. */
  readonly createdAt: string;
}

/** Datos ya validados para crear o editar una zona. */
export interface ZoneInput {
  readonly name: string;
  readonly description: string | null;
  readonly parentZoneId: number | null;
}

/** Lo que llega del formulario, antes de validarlo. */
export interface ZoneDraft {
  name: string;
  description?: string | null;
  parentZoneId?: number | null;
}
