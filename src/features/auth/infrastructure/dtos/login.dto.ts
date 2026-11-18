/**
 * @file login.dto.ts
 * @description Data Transfer Objects (DTOs) para el endpoint `POST /auth/login`.
 * Modela con exactitud la petición y los dos esquemas de respuesta posibles del backend NestJS.
 */

/**
 * DTO para el cuerpo enviado en `POST /auth/login`.
 *
 * - **¿Qué hace?**: Estructura `email`, `password` y el código TOTP opcional `twoFactorCode`.
 * - **¿Cómo interactúa con el sistema en general?**: Generado por `toLoginRequestDto` y transmitido por `HttpAuthRepository`.
 * - **¿Cuál es su importancia?**: Cumple con el esquema esperado por `LoginDto` del backend.
 */
export interface LoginRequestDto {
  email: string;
  password: string;
  twoFactorCode?: string;
}

/**
 * DTO para la respuesta exitosa de login cuando se expide el token.
 *
 * - **¿Qué hace?**: Contiene el token JWT, el ID numérico del usuario, su email y su arreglo de roles como strings.
 * - **¿Cómo interactúa con el sistema en general?**: Mapeado por `toLoginResult` para producir un `SessionUser`.
 * - **¿Cuál es su importancia?**: Proporciona las credenciales criptográficas necesarias para autenticar peticiones subsiguientes.
 */
export interface LoginSuccessDto {
  token: string;
  user_id: number;
  email: string;
  roles: string[];
}

/**
 * DTO para la respuesta de login cuando la cuenta tiene 2FA activo y aún no se suministró el código.
 *
 * - **¿Qué hace?**: Emite la bandera booleana `requires2FA: true` y un mensaje explicativo.
 * - **¿Cómo interactúa con el sistema en general?**: Detectado por `toLoginResult` para cambiar el formulario al paso de código TOTP.
 * - **¿Cuál es su importancia?**: Señaliza al cliente que debe solicitar el segundo factor sin exponer el token de sesión.
 */
export interface LoginTwoFactorRequiredDto {
  requires2FA: true;
  message: string;
}

/**
 * Tipo unión que agrupa las dos posibles respuestas exitosas del endpoint de inicio de sesión.
 */
export type LoginResponseDto = LoginSuccessDto | LoginTwoFactorRequiredDto;
