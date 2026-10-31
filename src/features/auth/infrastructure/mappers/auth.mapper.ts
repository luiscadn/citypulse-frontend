import { RoleName } from "@/shared/domain/enums";
import type { Credentials } from "../../domain/entities/credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { LoginRequestDto, LoginResponseDto } from "../dtos/login.dto";

const ROLE_VALUES = Object.values(RoleName) as string[];
const isRole = (value: string): value is RoleName => ROLE_VALUES.includes(value);

export function toRoles(raw: string[]): RoleName[] {
  return raw.filter(isRole);
}

export function toLoginRequestDto(credentials: Credentials): LoginRequestDto {
  const dto: LoginRequestDto = { email: credentials.email, password: credentials.password };
  if (credentials.twoFactorCode) dto.twoFactorCode = credentials.twoFactorCode;
  return dto;
}

export function toLoginResult(dto: LoginResponseDto): LoginResult {
  if ("requires2FA" in dto && dto.requires2FA) {
    return { kind: "two-factor-required" };
  }
  const success = dto as Exclude<LoginResponseDto, { requires2FA: true }>;
  return {
    kind: "authenticated",
    token: success.token,
    user: { id: success.user_id, email: success.email, roles: toRoles(success.roles) },
  };
}
