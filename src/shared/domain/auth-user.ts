// src/shared/domain/auth-user.ts
import type { RoleName } from './enums';

/**
 * Entidad / Contrato AuthUser: Representación del usuario autenticado en la capa cliente/frontend.
 *
 * - **¿Qué hace?**: Modela los atributos esenciales del usuario con sesión activa en la aplicación:
 *   su identificador numérico único (`id`), correo electrónico (`email`), nombre de usuario (`username`)
 *   y el listado inmutable de roles asignados (`roles: readonly RoleName[]`).
 * - **¿Cómo interactúa con el sistema en general?**: Se alimenta inicialmente a partir de la decodificación
 *   del token JWT o del endpoint de sesión (`/api/backend/...` o Server Actions). Es consumido ampliamente
 *   por el contexto de sesión de React (`SessionContext`), el hook `useSession`, los componentes de navegación (`AppNav`),
 *   y los mecanismos de autorización y renderizado condicional según permisos (ej. `admin-section-card.tsx`, `user-roles-admin.tsx`).
 * - **¿Cuál es su importancia?**: Centraliza la identidad del usuario en el frontend bajo un contrato inmutable (`readonly`).
 *   Garantiza que cualquier componente o servicio que requiera comprobar la identidad o los roles del usuario
 *   acceda a una estructura homogénea y tipada, desacoplada de la entidad de persistencia interna de la base de datos del backend.
 */
export interface AuthUser {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly roles: readonly RoleName[];
}
