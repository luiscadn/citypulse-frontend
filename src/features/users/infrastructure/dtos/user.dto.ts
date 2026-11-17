// src/features/users/infrastructure/dtos/user.dto.ts
/** Espejo EXACTO de la respuesta del backend (GET /users, GET /users/:id).
 *  NOTA: es la respuesta de SALIDA. NO es el CreateUserDto de entrada del backend.
 *  Sin passwordHash, sin twoFactorSecret (el backend los excluye con @Exclude()). */
export interface UserDto {
  id: number;
  email: string;
  username: string;
  fullName: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  zoneId?: number | null;
  createdAt: string;            // ISO
  userRoles?: { role: { name: string } }[];  // ← nested, snake/camel según backend
}