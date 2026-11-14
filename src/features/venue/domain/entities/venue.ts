/** Lugar (teatro, museo, parque...) que registra un OWNER y verifica un ADMIN. */
export interface Venue {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly address: string | null;
  readonly isVerified: boolean;
  readonly zone: VenueZone;
  readonly owner: VenueOwner;
  /** Fecha ISO de creación. */
  readonly createdAt: string;
}

export interface VenueZone {
  readonly id: number;
  readonly name: string;
}

/** Dueño del lugar. Sin correo ni datos internos de la cuenta. */
export interface VenueOwner {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
}

/** Filtros del listado público. null = sin filtrar. */
export interface VenueFilters {
  readonly zoneId: number | null;
  readonly isVerified: boolean | null;
  readonly page: number;
}

/** Una página del listado. */
export interface VenuePage {
  readonly venues: readonly Venue[];
  readonly total: number;
  readonly page: number;
  readonly lastPage: number;
}

/** Datos ya validados para registrar o editar un lugar. */
export interface VenueInput {
  readonly name: string;
  readonly address: string;
  readonly description: string | null;
  readonly zoneId: number;
}

/** Lo que llega del formulario, antes de validarlo. */
export interface VenueDraft {
  name: string;
  address: string;
  description?: string | null;
  zoneId: number;
}
