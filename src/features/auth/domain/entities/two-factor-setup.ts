/**
 * @file two-factor-setup.ts
 * @description Entidad de Dominio que representa los datos necesarios para enlazar una aplicación autenticadora TOTP.
 */

/**
 * Parámetros de configuración inicial para la verificación en dos pasos (2FA).
 *
 * - **¿Qué hace?**:
 *   Contiene el secreto criptográfico en formato Base32 (`secret`) para entrada manual
 *   y la imagen del código QR codificada en Data URL (`qrCodeUrl`) para escaneo directo en apps como Google Authenticator o Authy.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Generado por `SetupTwoFactorUseCase`, devuelto por `startTwoFactorAction` y renderizado en `TwoFactorPanel`.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite a los usuarios enrolar de forma intuitiva sus dispositivos móviles en el esquema de seguridad de doble factor.
 */
export interface TwoFactorSetup {
  /** Clave secreta compartida codificada en Base32. */
  secret: string;
  /** Imagen del código QR en formato Data URL (image/png;base64,...). */
  qrCodeUrl: string;
}
