// src/features/users/infrastructure/mappers/user.mapper.ts
import { RoleName } from '@/shared/domain/enums';
import type { User } from '../../domain/entities/user';
import type { UserDto } from '../dtos/user.dto';

/** DTO → Entidad. Aduana defensiva: valida el enum de roles y normaliza. */
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

function normalizeRoles(raw: UserDto['userRoles']): RoleName[] {
  const valid = Object.values(RoleName);
  return (raw ?? [])
    .map((ur) => ur.role.name as RoleName)
    .filter((r) => valid.includes(r));
}