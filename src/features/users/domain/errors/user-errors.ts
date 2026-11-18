// src/features/users/domain/errors/user-errors.ts
import { DomainError } from '@/shared/domain/errors/domain-error';

/**
 * Error lanzado cuando se intenta registrar o actualizar una cuenta con un correo ya existente.
 *
 * - **¿Qué hace?**: Indica conflicto por duplicidad en el correo electrónico proporcionado.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado en `HttpUserRepository` ante respuestas HTTP 409 Conflict y mostrado en formularios.
 * - **¿Cuál es su importancia?**: Preserva la regla de negocio que exige unicidad global del email como credencial principal.
 */
export class EmailAlreadyInUseError extends DomainError {
  constructor(readonly email: string) {
    super(`El email ${email} ya está registrado`);
  }
}

/**
 * Error lanzado cuando el nombre de usuario solicitado ya se encuentra ocupado por otra cuenta.
 *
 * - **¿Qué hace?**: Comunica colisión en el identificador textual público (`username`).
 * - **¿Cómo interactúa con el sistema en general?**: Capturado por `updateProfileAction` para resaltar en rojo el input `username`.
 * - **¿Cuál es su importancia?**: Asegura que cada `@username` en la red sea único, evitando suplantaciones o confusión.
 */
export class UsernameAlreadyInUseError extends DomainError {
  constructor(readonly username: string) {
    super(`El nombre de usuario ${username} ya está en uso`);
  }
}

/**
 * Error lanzado cuando el usuario identificado no existe en la base de datos.
 *
 * - **¿Qué hace?**: Notifica la inexistencia del usuario consultado por ID.
 * - **¿Cómo interactúa con el sistema en general?**: Producido por `HttpUserRepository.findById` ante respuestas HTTP 404.
 * - **¿Cuál es su importancia?**: Informa de forma precisa la ausencia de registros sin enmascarar errores internos del servidor.
 */
export class UserNotFoundError extends DomainError {
  constructor(readonly userId: number) {
    super(`El usuario ${userId} no existe`);
  }
}

/**
 * Error lanzado cuando un usuario intenta realizar una operación sin poseer los privilegios necesarios.
 *
 * - **¿Qué hace?**: Bloquea acciones prohibidas (como editar perfiles ajenos sin ser admin).
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por los use cases `UpdateUser` o `AssignRoles` y traducido de respuestas HTTP 403.
 * - **¿Cuál es su importancia?**: Hace cumplir las restricciones de seguridad y control de acceso basado en roles (RBAC).
 */
export class ForbiddenActionError extends DomainError {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message);
  }
}

/**
 * Error lanzado cuando un Administrador intenta retirarse a sí mismo el rol ADMIN.
 *
 * - **¿Qué hace?**: Impide la auto-democión del rol de superusuario.
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por la regla de negocio `wouldSelfDemote` en `AssignRoles` antes de llamar a la red.
 * - **¿Cuál es su importancia?**: Evita situaciones de orfandad administrativa o bloqueos accidentales de cuenta ("lockout") donde ningún admin pueda recuperar el control.
 */
export class SelfDemotionError extends DomainError {
  constructor() {
    super('No puedes quitarte tu propio rol ADMIN');
  }
}
export class InvalidUserError extends DomainError {
  constructor(message = "El usuario no es válido") {
    super(message);
  }
}
