// src/features/users/application/use-cases/update-user.ts
import type { AuthUser } from '@/shared/domain/auth-user';
import { canEditUser } from '../../domain/rules/permissions';
import { ForbiddenActionError } from '../../domain/errors/user-errors';
import type { User, UpdateUserParams } from '../../domain/entities/user';
import type { UserRepository } from '../repositories/user-repository';

export type UpdateUser = (
  id: number,
  params: UpdateUserParams,
  requester: AuthUser,
) => Promise<User>;

interface Deps { users: UserRepository }

export function makeUpdateUser({ users }: Deps): UpdateUser {
  return async (id, params, requester) => {
    // Regla UX: corta antes de la red si ni siquiera tiene permiso.
    // El backend vuelve a validar en UsersService.update().
    if (!canEditUser(requester, id)) {
      throw new ForbiddenActionError();
    }
    return users.update(id, params);
  };
}