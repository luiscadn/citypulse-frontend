// Reglas de formato de los campos de un usuario. Espejo UX de CreateUserDto / RegisterDto
// del backend (que valida de nuevo): sirven para avisar antes de la red.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 60;
export const FULL_NAME_MIN = 3;
export const FULL_NAME_MAX = 120;
export const EMAIL_MAX = 160;
export const PASSWORD_MIN = 8;
/** bcrypt ignora lo que pase de 72 bytes */
export const PASSWORD_MAX = 72;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

/** Cada regla devuelve el mensaje de error, o undefined si el valor es válido. */

export function validateEmail(email: string): string | undefined {
  if (!email) return "Escribe tu correo electrónico";
  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) return "El correo electrónico no es válido";
}

export function validateUsername(username: string): string | undefined {
  if (!username) return "Escribe un nombre de usuario";
  if (username.length < USERNAME_MIN) return `Debe tener al menos ${USERNAME_MIN} caracteres`;
  if (username.length > USERNAME_MAX) return `No puede superar los ${USERNAME_MAX} caracteres`;
  if (!USERNAME_PATTERN.test(username)) return "Solo letras, números, punto, guion y guion bajo";
}

export function validateFullName(fullName: string): string | undefined {
  if (!fullName) return "Escribe tu nombre completo";
  if (fullName.length < FULL_NAME_MIN) return `Debe tener al menos ${FULL_NAME_MIN} caracteres`;
  if (fullName.length > FULL_NAME_MAX) return `No puede superar los ${FULL_NAME_MAX} caracteres`;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Escribe una contraseña";
  if (password.length < PASSWORD_MIN) return `Debe tener al menos ${PASSWORD_MIN} caracteres`;
  if (password.length > PASSWORD_MAX) return `No puede superar los ${PASSWORD_MAX} caracteres`;
}
