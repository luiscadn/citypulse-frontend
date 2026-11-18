/**
 * @file user.mapper.ts
 * @description Mapeadores de Infraestructura para transformar entre DTOs de red y Entidades de Dominio de Usuario.
 * Implementa el patrón Anti-Corruption Layer (ACL) validando roles y transformando fechas ISO a objetos `Date`.
 */

import { RoleName } from "@/shared/domain/enums";
import type { User } from "../../domain/entities/user";
import type { UserDto } from "../dtos/user.dto";

/**
 * Transforma un DTO `UserDto` en una entidad inmutable de dominio `User`.
 *
 * - **¿Qué hace?**:
 *   Mapea los atributos de usuario, convierte la fecha ISO textual en una instancia de `Date`,
 *   y normaliza el arreglo anidado de roles mediante `normalizeRoles`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en todos los métodos de consulta y mutación de `HttpUserRepository`.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura que el dominio opere con objetos tipados y validados, filtrando roles desconocidos y fechas corruptas.
 */
export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    username: dto.username,
    fullName: dto.fullName,
    roles: normalizeRoles(dto.userRoles),
    isActive: dto.isActive,
    twoFactorEnabled: dto.twoFactorEnabled,
    zoneId: dto.zoneId,
    createdAt: new Date(dto.createdAt),
  };
}

/**
 * Función auxiliar para normalizar y validar los roles recibidos desde el DTO.
 *
 * - **¿Qué hace?**: Extrae el nombre de cada rol anidado y filtra solo aquellos que coincidan con los valores del enum `RoleName`.
 * - **¿Cómo interactúa con el sistema en general?**: Usada internamente en `toUser`.
 * - **¿Cuál es su importancia?**: Previene que valores arbitrarios o corruptos de la base de datos rompan el tipado del dominio.
 */
function normalizeRoles(raw: UserDto["userRoles"]): RoleName[] {
  const valid = Object.values(RoleName);
  return (raw ?? [])
    .map((ur) => ur.role.name as RoleName)
    .filter((r) => valid.includes(r));
}
