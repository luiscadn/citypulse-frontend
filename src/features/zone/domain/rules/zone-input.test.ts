import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import {
  InvalidZoneError,
  ZoneDescriptionTooLongError,
  ZoneNameRequiredError,
  ZoneNameTooLongError,
  ZoneSelfParentError,
} from "../errors/zone-errors";
import { normalizeZoneInput } from "./zone-input";
import { ZONE_DESCRIPTION_MAX_LENGTH, ZONE_NAME_MAX_LENGTH } from "./zone-limits";
import { canManageZones } from "./zone-permissions";

describe("normalizeZoneInput", () => {
  it("quita los espacios y convierte la descripción vacía en null", () => {
    expect(normalizeZoneInput({ name: "  San Antonio ", description: "   " })).toEqual({
      name: "San Antonio",
      description: null,
      parentZoneId: null,
    });
  });

  it("conserva la zona padre válida", () => {
    expect(normalizeZoneInput({ name: "Granada", description: " Gastronomía ", parentZoneId: 1 })).toEqual({
      name: "Granada",
      description: "Gastronomía",
      parentZoneId: 1,
    });
  });

  it.each(["", "   "])("rechaza el nombre %j", (name) => {
    expect(() => normalizeZoneInput({ name })).toThrow(ZoneNameRequiredError);
  });

  it("rechaza un nombre más largo que el del backend", () => {
    expect(() => normalizeZoneInput({ name: "a".repeat(ZONE_NAME_MAX_LENGTH + 1) })).toThrow(
      ZoneNameTooLongError,
    );
  });

  it("rechaza una descripción más larga que la del backend", () => {
    const description = "a".repeat(ZONE_DESCRIPTION_MAX_LENGTH + 1);
    expect(() => normalizeZoneInput({ name: "Cali", description })).toThrow(ZoneDescriptionTooLongError);
  });

  it.each([0, -3, 1.5, Number.NaN])("rechaza la zona padre %s", (parentZoneId) => {
    expect(() => normalizeZoneInput({ name: "Cali", parentZoneId })).toThrow(InvalidZoneError);
  });

  it("no deja que una zona sea su propia zona padre", () => {
    expect(() => normalizeZoneInput({ name: "Cali", parentZoneId: 4 }, 4)).toThrow(ZoneSelfParentError);
  });
});

describe("canManageZones", () => {
  it.each([
    [[RoleName.ADMIN], true],
    [[RoleName.USER, RoleName.ADMIN], true],
    [[RoleName.OWNER], false],
    [[RoleName.USER], false],
  ])("con roles %j devuelve %s", (roles, expected) => {
    expect(canManageZones({ roles })).toBe(expected);
  });

  it("sin sesión no deja gestionar zonas", () => {
    expect(canManageZones(null)).toBe(false);
  });
});
