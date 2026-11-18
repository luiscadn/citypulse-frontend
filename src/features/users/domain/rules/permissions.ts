/**
 * @file permissions.ts
 * @description Reglas de Dominio para el cálculo de autorizaciones sobre Usuarios.
 * Actúan como réplica UX (no autoritativa) para controlar la visibilidad y disponibilidad de funciones
 * en la interfaz de usuario; el backend siempre valida de forma definitiva por seguridad.
 */

import type { AuthUser } from "@/shared/domain/auth-user";
import { RoleName } from "@/shared/domain/enums";

/**
 * Determina si un usuario tiene permiso para editar la cuenta objetivo.
 *
 * - **¿Qué hace?**: Verifica si el solicitante es el propio dueño de la cuenta (`requester.id === targetUserId`) o si posee el rol `ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `makeUpdateUser` para cortar la ejecución antes de viajar por la red.
 * - **¿Cuál es su importancia?**: Impide que usuarios comunes modifiquen perfiles ajenos, salvaguardando la integridad de las cuentas.
 */
export function canEditUser(requester: AuthUser, targetUserId: number): boolean {
  return requester.id === targetUserId || requester.roles.includes(RoleName.ADMIN);
}

/**
 * Determina si el usuario tiene privilegios para eliminar cuentas de usuario.
 *
 * - **¿Qué hace?**: Comprueba si el solicitante cuenta con el rol `ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Condiciona la visibilidad de opciones de baja de usuarios.
 * - **¿Cuál es su importancia?**: Restringe la eliminación de cuentas exclusivamente a la administración.
 */
export function canDeleteUser(requester: AuthUser): boolean {
  return requester.roles.includes(RoleName.ADMIN);
}

/**
 * Determina si el usuario tiene permiso para asignar o modificar roles de otros usuarios.
 *
 * - **¿Qué hace?**: Evalúa si el solicitante tiene rol `ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `makeAssignRoles` y en el Server Component `UserRolesAdmin` para validar acceso al panel.
 * - **¿Cuál es su importancia?**: Asegura que solo el personal administrativo pueda escalar privilegios a otros usuarios.
 */
export function canAssignRoles(requester: AuthUser): boolean {
  return requester.roles.includes(RoleName.ADMIN);
}

/**
 * Regla de negocio que detecta si una asignación de roles provocaría la auto-democión del administrador.
 *
 * - **¿Qué hace?**: Comprueba si el usuario se está modificando a sí mismo y si en la nueva lista de roles se omitió `ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Invocada en `makeAssignRoles` para lanzar `SelfDemotionError` y en `UserRoleEditor` para deshabilitar la casilla.
 * - **¿Cuál es su importancia?**: Protege la continuidad operativa evitando que el administrador activo pierda acceso a la gestión de la plataforma.
 */
export function wouldSelfDemote(
  requester: AuthUser,
  targetUserId: number,
  newRoles: readonly RoleName[],
): boolean {
  return requester.id === targetUserId && !newRoles.includes(RoleName.ADMIN);
}
