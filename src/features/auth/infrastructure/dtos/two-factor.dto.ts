/** POST /auth/2fa/generate — respuesta */
export interface TwoFactorSetupDto {
  secret: string;
  qrCodeUrl: string;
}

/** POST /auth/2fa/enable — cuerpo (Verify2FADto) */
export interface EnableTwoFactorRequestDto {
  code: string;
}