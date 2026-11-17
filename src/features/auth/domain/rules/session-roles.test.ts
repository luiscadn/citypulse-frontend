import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import { hasRole } from "./session-roles";

const owner = { id: 1, email: "owner@test.com", roles: [RoleName.USER, RoleName.OWNER] };

describe("hasRole", () => {
  it("reconoce los roles que tiene el usuario", () => {
    expect(hasRole(owner, RoleName.OWNER)).toBe(true);
    expect(hasRole(owner, RoleName.USER)).toBe(true);
  });

  it("no da un rol que el usuario no tiene", () => {
    expect(hasRole(owner, RoleName.ADMIN)).toBe(false);
  });

  it("sin sesión no hay ningún rol", () => {
    expect(hasRole(null, RoleName.USER)).toBe(false);
  });
});
