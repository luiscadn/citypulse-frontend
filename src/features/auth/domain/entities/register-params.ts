/**
 * @file register-params.ts
 * @description Entidad de Dominio que modela los parámetros necesarios para registrar una nueva cuenta de usuario.
 */

/**
 * Parámetros para el autoregistro comunitario de una cuenta.
 *
 * - **¿Qué hace?**:
 *   Estructura los datos capturados en el formulario de alta: email, username, fullName y password en texto plano.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Dominio. Es validado por `validateRegistration`, consumido por `RegisterUseCase`
 *   y enviado al repositorio `AuthRepository.register`.
 *
 * - **¿Cuál es su importancia?**:
 *   Diferencia el autoregistro público del alta administrativa, asegurando que el usuario nuevo ingrese
 *   siempre con el rol base `USER` asignado de forma segura por el backend.
 */
export interface RegisterParams {
  email: string;
  username: string;
  fullName: string;
  password: string;
}
