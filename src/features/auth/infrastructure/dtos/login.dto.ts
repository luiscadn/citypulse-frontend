/** POST /auth/login — cuerpo que espera el backend */
export interface LoginRequestDto {
  email: string;
  password: string;
  twoFactorCode?: string;
}

/** POST /auth/login — respuesta cuando las credenciales son válidas */
export interface LoginSuccessDto {
  token: string;
  user_id: number;
  email: string;
  roles: string[];
}

/** POST /auth/login — respuesta cuando el usuario tiene 2FA y no mandó el código */
export interface LoginTwoFactorRequiredDto {
  requires2FA: true;
  message: string;
}

export type LoginResponseDto = LoginSuccessDto | LoginTwoFactorRequiredDto;
