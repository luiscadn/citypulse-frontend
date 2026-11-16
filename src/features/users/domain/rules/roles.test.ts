import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import { parseRoles } from "./roles";

describe("parseRoles", () => {
  it("acepta roles válidos y los devuelve en orden, sin repetidos", () => {
    expect(parseRoles(["ADMIN", "USER", "ADMIN"])).toEqual([RoleName.USER, RoleName.ADMIN]);
  });

  it("rechaza una lista vacía (el backend exige al menos un rol)", () => {
    expect(parseRoles([])).toBeNull();
  });

  it("rechaza valores que no son roles", () => {
    expect(parseRoles(["USER", "SUPERADMIN"])).toBeNull();
    expect(parseRoles([1])).toBeNull();
  });

  it("rechaza lo que no es una lista", () => {
    expect(parseRoles("ADMIN")).toBeNull();
    expect(parseRoles(undefined)).toBeNull();
  });
});
