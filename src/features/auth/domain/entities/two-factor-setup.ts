/** Lo que el usuario necesita para enlazar su app autenticadora. */
export interface TwoFactorSetup {
  /** Clave en base32, para escribirla a mano si no puede escanear el QR */
  secret: string;
  /** Imagen del QR como data URL (PNG) */
  qrCodeUrl: string;
}