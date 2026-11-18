/**
 * @file auth-errors.ts
 * @description Jerarquía de errores de Dominio asociados a la autenticación, registro y verificación en dos pasos.
 */

import { DomainError } from "@/shared/domain/errors/domain-error";
import type { RegistrationErrors } from "../rules/registration";

/**
 * Error lanzado cuando las credenciales suministradas no coinciden con ninguna cuenta activa.
 *
 * - **¿Qué hace?**: Indica fallo de autenticación de usuario o clave incorrecta.
 * - **¿Cómo interactúa con el sistema en general?**: Capturado por `loginAction` para mostrar alerta en `LoginForm`.
 * - **¿Cuál es su importancia?**: Mensaje genérico por diseño de seguridad, evitando revelar si el fallo fue por el correo o por la contraseña.
 */
export class InvalidCredentialsError extends DomainError {
  constructor(message = "Correo o contraseña incorrectos") {
    super(message);
  }
}

/**
 * Error lanzado cuando el código TOTP suministrado de segundo factor es erróneo o expiró.
 *
 * - **¿Qué hace?**: Indica código 2FA inválido en login o en el proceso de activación.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado en `HttpAuthRepository` y `HttpTwoFactorRepository`.
 * - **¿Cuál es su importancia?**: Protege la barrera de verificación multifactor contra códigos falsos o vencidos.
 */
export class InvalidTwoFactorCodeError extends DomainError {
  constructor(message = "El código 2FA no es válido") {
    super(message);
  }
}

/**
 * Error lanzado cuando los datos ingresados en el registro violan las reglas de formato.
 *
 * - **¿Qué hace?**: Encapsula un diccionario de errores por campo (`RegistrationErrors`).
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `RegisterUseCase` y transformado en mensajes individuales en `RegisterForm`.
 * - **¿Cuál es su importancia?**: Comunica fallas estructurales antes de viajar al servidor, mejorando la respuesta de la interfaz.
 */
export class InvalidRegistrationError extends DomainError {
  constructor(readonly errors: RegistrationErrors) {
    super("Revisa los datos del formulario");
  }
}

/**
 * Error lanzado cuando el correo ya se encuentra registrado por otro usuario.
 *
 * - **¿Qué hace?**: Señala conflicto de unicidad sobre el email durante el registro.
 * - **¿Cómo interactúa con el sistema en general?**: Capturado en `registerAction` para asociar el error al campo `email`.
 * - **¿Cuál es su importancia?**: Garantiza la unicidad de las credenciales de acceso.
 */
export class EmailAlreadyRegisteredError extends DomainError {
  constructor() {
    super("Ya existe una cuenta con este correo");
  }
}

/**
 * Error lanzado cuando el nombre de usuario ya está tomado por otra persona.
 *
 * - **¿Qué hace?**: Señala conflicto de unicidad sobre el `@username`.
 * - **¿Cómo interactúa con el sistema en general?**: Capturado en `registerAction` para vincularlo al campo `username`.
 * - **¿Cuál es su importancia?**: Protege la identidad única de cada miembro de la plataforma.
 */
export class UsernameAlreadyRegisteredError extends DomainError {
  constructor() {
    super("Este nombre de usuario ya está en uso");
  }
}

/**
 * Error lanzado cuando se intenta iniciar la configuración de 2FA en una cuenta que ya lo tiene activo.
 *
 * - **¿Qué hace?**: Advierte que el usuario debe desactivar el 2FA antes de generar un nuevo secreto.
 * - **¿Cómo interactúa con el sistema en general?**: Lanzado por `HttpTwoFactorRepository.setup` ante respuestas HTTP 400.
 * - **¿Cuál es su importancia?**: Previene la sobreescritura accidental de secretos criptográficos activos.
 */
export class TwoFactorAlreadyEnabledError extends DomainError {
  constructor() {
    super("La verificación en dos pasos ya está activa");
  }
}
