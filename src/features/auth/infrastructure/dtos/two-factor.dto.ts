/**
 * @file two-factor.dto.ts
 * @description Data Transfer Objects (DTOs) para la gestión del segundo factor de autenticación (TOTP).
 */

/**
 * DTO para la respuesta del endpoint `POST /auth/2fa/generate`.
 *
 * - **¿Qué hace?**: Contiene el secreto Base32 y el Data URL del código QR.
 * - **¿Cómo interactúa con el sistema en general?**: Recibido por `HttpTwoFactorRepository.setup`.
 * - **¿Cuál es su importancia?**: Transporta la información para sincronizar la aplicación autenticadora.
 */
export interface TwoFactorSetupDto {
  secret: string;
  qrCodeUrl: string;
}

/**
 * DTO para el cuerpo de la petición `POST /auth/2fa/enable`.
 *
 * - **¿Qué hace?**: Estructura el código de prueba enviado (`Verify2FADto`).
 * - **¿Cómo interactúa con el sistema en general?**: Transmitido por `HttpTwoFactorRepository.enable`.
 * - **¿Cuál es su importancia?**: Provee el valor requerido para la activación definitiva del 2FA.
 */
export interface EnableTwoFactorRequestDto {
  code: string;
}
