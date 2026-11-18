/**
 * @file auth-repository.ts
 * @description Puerto secundario (interfaz) para el servicio de Autenticación.
 * En Arquitectura Hexagonal / Clean Architecture, define las operaciones de inicio de sesión y registro sin acoplarse a HTTP.
 */

import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { RegisterParams } from "../../domain/entities/register-params";

/**
 * Contrato de repositorio para autenticación y registro de usuarios.
 *
 * - **¿Qué hace?**:
 *   Declara los métodos para iniciar sesión (`login`) y para crear cuentas comunitarias (`register`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Implementado por `HttpAuthRepository` en la capa de Infraestructura y consumido por `LoginUseCase` y `RegisterUseCase`.
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el Principio de Inversión de Dependencias (DIP), desacoplando los flujos de seguridad del transporte de red.
 */
export interface AuthRepository {
  /** Valida credenciales e inicia sesión devolviendo el resultado de autenticación o requerimiento de 2FA. */
  login(credentials: Credentials): Promise<LoginResult>;

  /** Registra una nueva cuenta en el backend. */
  register(params: RegisterParams): Promise<void>;
}
