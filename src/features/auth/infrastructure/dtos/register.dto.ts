/** POST /auth/register — cuerpo que espera el backend (RegisterDto) */
export interface RegisterRequestDto {
  email: string;
  username: string;
  fullName: string;
  password: string;
}