// src/features/users/application/use-cases/assign-roles.ts
import type { AuthUser } from '@/shared/domain/auth-user';
import type { RoleName } from '@/shared/domain/enums';
import { canAssignRoles, wouldSelfDemote } from '../../domain/rules/permissions';
import { ForbiddenActionError, SelfDemotionError } from '../../domain/errors/user-errors';
import type { User } from '../../domain/entities/user';
import type { UserRepository } from '../repositories/user-repository';

export type AssignRoles = (
  id: number,
  roles: readonly RoleName[],
  requester: AuthUser,
) => Promise<User>;

export function makeAssignRoles({ users }: { users: UserRepository }): AssignRoles {
  return async (id, roles, requester) => {
    if (!canAssignRoles(requester)) throw new ForbiddenActionError();
    if (wouldSelfDemote(requester, id, roles)) throw new SelfDemotionError();
    return users.assignRoles(id, roles);
  };
}