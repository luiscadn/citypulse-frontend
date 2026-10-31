// src/features/users/application/use-cases/list-users.ts
import type { User } from '../../domain/entities/user';
import type { UserRepository } from '../repositories/user-repository';

export type ListUsers = () => Promise<User[]>;
interface Deps { users: UserRepository }

export function makeListUsers({ users }: Deps): ListUsers {
  return () => users.findAll();
}