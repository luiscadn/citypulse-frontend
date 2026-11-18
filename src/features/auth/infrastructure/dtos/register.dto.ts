/**
 * @file register.dto.ts
 * @description Data Transfer Object (DTO) para la petición al endpoint `POST /auth/register`.
 */

/**
 * DTO para el cuerpo enviado al registrar una nueva cuenta comunitaria.
 *
 * - **¿Qué hace?**: Estructura `email`, `username`, `fullName` y `password`.
 * - **¿Cómo interactúa con el sistema en general?**: Enviado por `HttpAuthRepository.register` a la API NestJS.
 * - **¿Cuál es su importancia?**: Coincide estrictamente con la clase `RegisterDto` del backend.
 */
export interface RegisterRequestDto {
  email: string;
  username: string;
  fullName: string;
  password: string;
}
