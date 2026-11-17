// src/features/users/infrastructure/mappers/user.mapper.ts
import { RoleName } from '@/shared/domain/enums';
import { createUser, type User } from '../../domain/entities/user';
import type { UserDto } from '../dtos/user.dto';

/** DTO → Entidad. Aduana defensiva: valida el enum de roles y normaliza. */
export function toUser(dto: UserDto): User {
  return createUser({
    id: dto.id,
    email: dto.email,
    username: dto.username,
    fullName: dto.fullName,
    roles: normalizeRoles(dto.userRoles),
    isActive: dto.isActive,
    twoFactorEnabled: dto.twoFactorEnabled,
    zoneId: dto.zoneId ?? null,
    createdAt: new Date(dto.createdAt),
  });
}

function normalizeRoles(raw: UserDto['userRoles']): RoleName[] {
  const valid = Object.values(RoleName);
  const roles = (raw ?? [])
    .map((ur) => ur.role.name as RoleName)
    .filter((r) => valid.includes(r));
  return [...new Set(roles)];
}