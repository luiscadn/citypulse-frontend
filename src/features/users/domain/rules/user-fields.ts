/**
 * @file user-fields.ts
 * @description Reglas de Dominio, límites cuantitativos y validadores de formato para campos de usuario.
 * Actúan como réplica UX de `CreateUserDto` / `RegisterDto` del backend para validación instantánea en formularios.
 */

/** Longitud mínima para el nombre de usuario (3 caracteres). */
export const USERNAME_MIN = 3;
/** Longitud máxima para el nombre de usuario (60 caracteres). */
export const USERNAME_MAX = 60;
/** Longitud mínima para el nombre completo (3 caracteres). */
export const FULL_NAME_MIN = 3;
/** Longitud máxima para el nombre completo (120 caracteres). */
export const FULL_NAME_MAX = 120;
/** Longitud máxima para el correo electrónico (160 caracteres). */
export const EMAIL_MAX = 160;
/** Longitud mínima para la contraseña (8 caracteres). */
export const PASSWORD_MIN = 8;
/** Longitud máxima para la contraseña (72 bytes, límite estructural del algoritmo bcrypt). */
export const PASSWORD_MAX = 72;

/** Expresión regular estándar para validación básica de formato de correo electrónico. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Expresión regular para caracteres válidos en username (alfanumérico, punto, guion y guion bajo). */
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

/**
 * Valida el campo de correo electrónico.
 *
 * - **¿Qué hace?**: Verifica presencia, longitud máxima y formato regular de email; retorna mensaje de error o `undefined` si es válido.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en formularios de registro, login y edición de perfil.
 * - **¿Cuál es su importancia?**: Evita envíos de correos mal formados que rebotarían en el backend.
 */
export function validateEmail(email: string): string | undefined {
  if (!email) return "Escribe tu correo electrónico";
  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) return "El correo electrónico no es válido";
}

/**
 * Valida el nombre de usuario (`username`).
 *
 * - **¿Qué hace?**: Comprueba presencia, longitudes mínima/máxima y caracteres permitidos; retorna mensaje de error o `undefined`.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `validateProfile` y formularios de autenticación.
 * - **¿Cuál es su importancia?**: Garantiza nombres de usuario limpios y aptos para URLs y menciones en la plataforma.
 */
export function validateUsername(username: string): string | undefined {
  if (!username) return "Escribe un nombre de usuario";
  if (username.length < USERNAME_MIN) return `Debe tener al menos ${USERNAME_MIN} caracteres`;
  if (username.length > USERNAME_MAX) return `No puede superar los ${USERNAME_MAX} caracteres`;
  if (!USERNAME_PATTERN.test(username)) return "Solo letras, números, punto, guion y guion bajo";
}

/**
 * Valida el nombre completo de la persona (`fullName`).
 *
 * - **¿Qué hace?**: Verifica presencia y longitudes permitidas; retorna mensaje de error o `undefined`.
 * - **¿Cómo interactúa con el sistema en general?**: Evaluado en `validateProfile` y en formularios de registro.
 * - **¿Cuál es su importancia?**: Asegura que el usuario proporcione una identificación humana legible.
 */
export function validateFullName(fullName: string): string | undefined {
  if (!fullName) return "Escribe tu nombre completo";
  if (fullName.length < FULL_NAME_MIN) return `Debe tener al menos ${FULL_NAME_MIN} caracteres`;
  if (fullName.length > FULL_NAME_MAX) return `No puede superar los ${FULL_NAME_MAX} caracteres`;
}

/**
 * Valida la contraseña del usuario.
 *
 * - **¿Qué hace?**: Comprueba obligatoriedad, longitud mínima (8) y máxima segura (72 por limitación de bcrypt).
 * - **¿Cómo interactúa con el sistema en general?**: Usada en la creación y cambio de contraseñas.
 * - **¿Cuál es su importancia?**: Previene contraseñas débiles o truncadas silenciosamente por la función de hash.
 */
export function validatePassword(password: string): string | undefined {
  if (!password) return "Escribe una contraseña";
  if (password.length < PASSWORD_MIN) return `Debe tener al menos ${PASSWORD_MIN} caracteres`;
  if (password.length > PASSWORD_MAX) return `No puede superar los ${PASSWORD_MAX} caracteres`;
}
