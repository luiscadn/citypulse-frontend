// src/features/users/infrastructure/repositories/http-user-repository.ts
import { HttpError, type HttpClient } from '@/shared/infrastructure/http-client';
import type { UserRepository } from '../../application/repositories/user-repository';
import type { User, CreateUserParams, UpdateUserParams } from '../../domain/entities/user';
import type { RoleName } from '@/shared/domain/enums';
import {
  EmailAlreadyInUseError,
  UsernameAlreadyInUseError,
  UserNotFoundError,
  ForbiddenActionError,
} from '../../domain/errors/user-errors';
import type { UserDto } from '../dtos/user.dto';
import { toUser } from '../mappers/user.mapper';

export class HttpUserRepository implements UserRepository {
  constructor(private readonly http: HttpClient) {}

  async findAll(): Promise<User[]> {
    // GET /users responde paginado: { data, total, page, limit, lastPage }
    const page = await this.http.get<{ data: UserDto[] }>('/users?limit=100');
    return page.data.map(toUser);
  }

  async findById(id: number): Promise<User> {
    try {
      const dto = await this.http.get<UserDto>(`/users/${id}`);
      return toUser(dto);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  async create(params: CreateUserParams): Promise<User> {
    try {
      const dto = await this.http.post<UserDto>('/users', params);
      return toUser(dto);
    } catch (e) {
      throw this.translateCreate(e, params);
    }
  }

  async update(id: number, params: UpdateUserParams): Promise<User> {
    try {
      const dto = await this.http.patch<UserDto>(`/users/${id}`, params);
      return toUser(dto);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.http.delete(`/users/${id}`);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  async assignRoles(id: number, roles: readonly RoleName[]): Promise<User> {
    try {
      const dto = await this.http.patch<UserDto>(`/users/${id}/roles`, { roles });
      return toUser(dto);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  // ── Traducción de errores HTTP → errores del dominio ───────────────
  private translate(e: unknown, userId: number): unknown {
    if (e instanceof HttpError) {
      if (e.status === 404) return new UserNotFoundError(userId);
      if (e.status === 403) return new ForbiddenActionError();
      if (e.status === 409) return new EmailAlreadyInUseError(''); // genérico
    }
    return e;
  }

  private translateCreate(e: unknown, p: CreateUserParams): unknown {
    if (e instanceof HttpError && e.status === 409) {
      // El backend responde "Email X already in use" o "Username X already in use"
      const msg = String((e.body as { message?: string })?.message ?? '');
      if (msg.toLowerCase().includes('email')) return new EmailAlreadyInUseError(p.email);
      if (msg.toLowerCase().includes('username')) return new UsernameAlreadyInUseError(p.username);
    }
    return e;
  }
}