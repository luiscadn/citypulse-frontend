/** Datos para crear una cuenta. El backend asigna el rol USER por su cuenta. */
export interface RegisterParams {
  email: string;
  username: string;
  fullName: string;
  password: string;
}