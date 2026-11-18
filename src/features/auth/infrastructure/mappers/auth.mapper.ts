/**
 * @file auth.mapper.ts
 * @description Mapeadores de Infraestructura para transformar entre DTOs de autenticación y Entidades de Dominio.
 */

import { RoleName } from "@/shared/domain/enums";
import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { LoginRequestDto, LoginResponseDto } from "../dtos/login.dto";

const ROLE_VALUES = Object.values(RoleName) as string[];
const isRole = (value: string): value is RoleName => ROLE_VALUES.includes(value);

/**
 * Normaliza y valida una lista de roles en texto plano hacia elementos válidos de `RoleName`.
 */
export function toRoles(raw: string[]): RoleName[] {
  return raw.filter(isRole);
}

/**
 * Convierte un objeto de dominio `Credentials` en el DTO de petición `LoginRequestDto`.
 *
 * - **¿Qué hace?**: Estructura `email` y `password`, añadiendo `twoFactorCode` solo si fue provisto.
 * - **¿Cómo interactúa con el sistema en general?**: Usado por `HttpAuthRepository.login`.
 * - **¿Cuál es su importancia?**: Genera un payload limpio sin propiedades `undefined` innecesarias.
 */
export function toLoginRequestDto(credentials: Credentials): LoginRequestDto {
  const dto: LoginRequestDto = { email: credentials.email, password: credentials.password };
  if (credentials.twoFactorCode) dto.twoFactorCode = credentials.twoFactorCode;
  return dto;
}

/**
 * Transforma la respuesta HTTP de login en el resultado discriminado de dominio `LoginResult`.
 *
 * - **¿Qué hace?**:
 *   Detecta si la respuesta contiene `requires2FA: true` retornando `{ kind: "two-factor-required" }`.
 *   En caso contrario, mapea el token y los roles construyendo `{ kind: "authenticated", token, user }`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en `HttpAuthRepository.login` para aislar al dominio de la estructura cruda de red.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que la capa de aplicación reciba tipos seguros sin lidiar con campos disjuntos de API.
 */
export function toLoginResult(dto: LoginResponseDto): LoginResult {
  if ("requires2FA" in dto && dto.requires2FA) {
    return { kind: "two-factor-required" };
  }
  const success = dto as Exclude<LoginResponseDto, { requires2FA: true }>;
  return {
    kind: "authenticated",
    token: success.token,
    user: { id: success.user_id, email: success.email, roles: toRoles(success.roles) },
  };
}
