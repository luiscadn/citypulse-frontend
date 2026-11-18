/**
 * @file session-user.ts
 * @description Entidad ligera de Dominio que modela al usuario autenticado según la información extraída de su JWT.
 */

import type { RoleName } from "@/shared/domain/enums";

/**
 * Representación mínima del usuario obtenida del payload de la cookie de sesión.
 *
 * - **¿Qué hace?**:
 *   Agrupa el identificador numérico (`id`), el correo electrónico (`email`) y la lista de roles (`roles`)
 *   codificados dentro del token JWT emitido por el backend.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Retornado por la función de infraestructura `getCurrentUser()`, provisto al árbol de React mediante
 *   `SessionContext` / `useSession()`, y utilizado por Server Actions y componentes para autorizaciones rápidas.
 *
 * - **¿Cuál es su importancia?**:
 *   Rendimiento y arquitectura sin estado (stateless): permite consultar los datos de autorización y roles
 *   del usuario actual sin requerir una consulta de red hacia la base de datos en cada navegación.
 */
export interface SessionUser {
  id: number;
  email: string;
  roles: RoleName[];
}
