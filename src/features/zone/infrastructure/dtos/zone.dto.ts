/** Respuesta de GET /zone y GET /zone/:id (la entidad Zone del backend). */
export interface ZoneDto {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  /** Hoy el backend no carga la relación; si algún día la envía, se usa. */
  parent?: { id: number } | null;
}

/** Cuerpo de POST /zone y PATCH /zone/:id (CreateZoneDto / UpdateZoneDto). */
export interface ZoneBodyDto {
  name: string;
  description?: string | null;
  parentZoneId?: number;
}
