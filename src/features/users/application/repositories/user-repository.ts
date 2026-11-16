// src/features/users/application/repositories/user-repository.ts
import type { User, CreateUserParams, UpdateUserParams } from '../../domain/entities/user';
import type { RoleName } from '@/shared/domain/enums';

/** PUERTO. La aplicación dice qué necesita. No sabe si por debajo hay
 *  fetch, localStorage o un mock en tests. */
export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  create(params: CreateUserParams): Promise<User>;
  update(id: number, params: UpdateUserParams): Promise<User>;
  delete(id: number): Promise<void>;
  assignRoles(id: number, roles: readonly RoleName[]): Promise<User>;
}