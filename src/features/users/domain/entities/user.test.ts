import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import { InvalidUserError } from "../errors/user-errors";
import { createUser, type User } from "./user";

const valid: User = {
  id: 4,
  email: "ana@citypulse.co",
  username: "ana",
  fullName: "Ana Pérez",
  roles: [RoleName.USER],
  isActive: true,
  twoFactorEnabled: false,
  zoneId: null,
  createdAt: new Date("2026-10-01T12:00:00.000Z"),
};

describe("createUser", () => {
  it("construye un usuario válido y lo congela", () => {
    const user = createUser(valid);
    expect(user).toEqual(valid);
    expect(Object.isFrozen(user)).toBe(true);
    expect(Object.isFrozen(user.roles)).toBe(true);
  });

  it("rechaza un correo mal formado", () => {
    expect(() => createUser({ ...valid, email: "ana-sin-arroba" })).toThrow(InvalidUserError);
  });

  it("rechaza roles desconocidos o repetidos", () => {
    expect(() => createUser({ ...valid, roles: ["ROOT" as RoleName] })).toThrow(InvalidUserError);
    expect(() => createUser({ ...valid, roles: [RoleName.USER, RoleName.USER] })).toThrow(InvalidUserError);
  });

  it("rechaza una fecha de creación inválida", () => {
    expect(() => createUser({ ...valid, createdAt: new Date("no-es-fecha") })).toThrow(InvalidUserError);
  });
});
