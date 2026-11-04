// src/features/users/application/use-cases/get-user.ts
import type { User } from '../../domain/entities/user';
import type { UserRepository } from '../repositories/user-repository';

export type GetUser = (id: number) => Promise<User>;

export function makeGetUser({ users }: { users: UserRepository }): GetUser {
  return (id) => users.findById(id);
}
