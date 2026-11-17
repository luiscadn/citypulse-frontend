import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthUser } from "@/shared/domain/auth-user";
import { RoleName } from "@/shared/domain/enums";
import { ForbiddenActionError, SelfDemotionError } from "../../domain/errors/user-errors";
import type { UserRepository } from "../repositories/user-repository";
import { makeAssignRoles } from "./assign-roles";

describe("makeAssignRoles", () => {
  const users = {
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    assignRoles: vi.fn(),
  } satisfies Partial<UserRepository>;
  const assignRoles = makeAssignRoles({ users: users as unknown as UserRepository });

  const admin: AuthUser = { id: 1, email: "admin@citypulse.co", username: "admin", roles: [RoleName.ADMIN] };
  const regular: AuthUser = { id: 2, email: "ana@citypulse.co", username: "ana", roles: [RoleName.USER] };

  beforeEach(() => vi.resetAllMocks());

  it("un ADMIN asigna roles a otro usuario", async () => {
    users.assignRoles.mockResolvedValue({ id: 2 });

    await assignRoles(2, [RoleName.USER, RoleName.OWNER], admin);

    expect(users.assignRoles).toHaveBeenCalledWith(2, [RoleName.USER, RoleName.OWNER]);
  });

  it("un usuario sin rol ADMIN no puede asignar roles", async () => {
    await expect(assignRoles(3, [RoleName.ADMIN], regular)).rejects.toBeInstanceOf(ForbiddenActionError);
    expect(users.assignRoles).not.toHaveBeenCalled();
  });

  it("un ADMIN no puede quitarse a sí mismo el rol ADMIN", async () => {
    await expect(assignRoles(1, [RoleName.USER], admin)).rejects.toBeInstanceOf(SelfDemotionError);
    expect(users.assignRoles).not.toHaveBeenCalled();
  });

  it("un ADMIN sí puede cambiar sus otros roles si conserva ADMIN", async () => {
    users.assignRoles.mockResolvedValue({ id: 1 });

    await assignRoles(1, [RoleName.ADMIN, RoleName.OWNER], admin);

    expect(users.assignRoles).toHaveBeenCalled();
  });
});
