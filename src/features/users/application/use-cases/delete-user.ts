// src/features/users/application/use-cases/delete-user.ts
import type { AuthUser } from '@/shared/domain/auth-user';
import { canDeleteUser } from '../../domain/rules/permissions';
import { ForbiddenActionError } from '../../domain/errors/user-errors';
import type { UserRepository } from '../repositories/user-repository';

export type DeleteUser = (id: number, requester: AuthUser) => Promise<void>;

export function makeDeleteUser({ users }: { users: UserRepository }): DeleteUser {
  return async (id, requester) => {
    if (!canDeleteUser(requester)) throw new ForbiddenActionError();
    await users.delete(id);
  };
}