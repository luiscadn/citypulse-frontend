// src/shared/domain/enums.ts
/** Espejo exacto de src/common/enums.ts del backend.
 *  Si el backend cambia un valor, esto debe cambiar. */
export enum RoleName {
  USER = 'USER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

export enum EventOrigin {
  REPORTE_USUARIO = 'REPORTE_USUARIO',
  OFICIAL = 'OFICIAL',
}

export enum EventStatus {
  REPORTADO = 'REPORTADO',
  CONFIRMADO = 'CONFIRMADO',
  RECHAZADO = 'RECHAZADO',
  CANCELADO = 'CANCELADO',
}

export enum EventVisibility {
  PUBLICO = 'PUBLICO',
  PRIVADO = 'PRIVADO',
}