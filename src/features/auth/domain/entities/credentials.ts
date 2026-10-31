export interface Credentials {
  email: string;
  password: string;
  /** Código TOTP de 6 dígitos, solo si el usuario tiene 2FA activo */
  twoFactorCode?: string;
}
