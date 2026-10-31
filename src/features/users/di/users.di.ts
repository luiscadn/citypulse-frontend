// src/features/users/di/users.di.ts
import { http } from '@/shared/di/http';
import { HttpUserRepository } from '../infrastructure/repositories/http-user-repository';

export const userRepository = new HttpUserRepository(http);