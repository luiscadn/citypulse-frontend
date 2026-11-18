/**
 * @file credentials.ts
 * @description Objeto de Dominio que modela las credenciales de acceso suministradas por un usuario.
 */

/**
 * Credenciales para autenticación de usuario.
 *
 * - **¿Qué hace?**:
 *   Estructura los datos requeridos para iniciar sesión: correo electrónico (`email`), contraseña (`password`)
 *   y el código temporal de 6 dígitos opcional (`twoFactorCode`) cuando la cuenta tiene verificación en dos pasos (TOTP) activa.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Dominio. Es construido a partir de los datos del formulario por las Server Actions
 *   y consumido por `LoginUseCase` y el puerto `AuthRepository.login`.
 *
 * - **¿Cuál es su importancia?**:
 *   Estandariza los parámetros de acceso tanto para cuentas estándar de un solo factor como para cuentas protegidas con 2FA.
 */
export interface Credentials {
  email: string;
  password: string;
  /** Código TOTP de 6 dígitos emitido por la app autenticadora, solo si el usuario tiene 2FA activo. */
  twoFactorCode?: string;
}
