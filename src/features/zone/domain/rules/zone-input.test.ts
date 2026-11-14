import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import {
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
    expect(normalizeZoneInput({ name: "  San Antonio ", description: "   ", parentZoneId: 1 })).toEqual({
      name: "San Antonio",
      description: null,
      parentZoneId: 1,
    });
  });

  it("exige un nombre", () => {
    expect(() => normalizeZoneInput({ name: "   " })).toThrow(ZoneNameRequiredError);
  });

  it("respeta los límites de longitud del backend", () => {
    expect(() => normalizeZoneInput({ name: "a".repeat(ZONE_NAME_MAX_LENGTH + 1) })).toThrow(ZoneNameTooLongError);
    expect(() =>
      normalizeZoneInput({ name: "Cali", description: "a".repeat(ZONE_DESCRIPTION_MAX_LENGTH + 1) }),
    ).toThrow(ZoneDescriptionTooLongError);
  });

  it("no deja que una zona sea su propia zona padre", () => {
    expect(() => normalizeZoneInput({ name: "Cali", parentZoneId: 4 }, 4)).toThrow(ZoneSelfParentError);
  });
});

describe("canManageZones", () => {
  it("solo el ADMIN gestiona zonas", () => {
    expect(canManageZones({ roles: [RoleName.ADMIN] })).toBe(true);
    expect(canManageZones({ roles: [RoleName.OWNER, RoleName.USER] })).toBe(false);
    expect(canManageZones(null)).toBe(false);
  });
});
