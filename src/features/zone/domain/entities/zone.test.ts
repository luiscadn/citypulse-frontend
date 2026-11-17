import { describe, expect, it } from "vitest";
import { InvalidZoneError, ZoneSelfParentError } from "../errors/zone-errors";
import { createZone, type Zone } from "./zone";

const valid: Zone = { id: 3, name: "San Antonio", description: null, parentId: 1, createdAt: "2026-10-01T12:00:00.000Z" };

describe("createZone", () => {
  it("construye una zona válida y la congela", () => {
    const zone = createZone(valid);
    expect(zone).toEqual(valid);
    expect(Object.isFrozen(zone)).toBe(true);
  });

  it("rechaza un ID que no es un entero positivo", () => {
    expect(() => createZone({ ...valid, id: 0 })).toThrow(InvalidZoneError);
  });

  it("rechaza un nombre vacío", () => {
    expect(() => createZone({ ...valid, name: "   " })).toThrow(InvalidZoneError);
  });

  it("no deja que una zona sea su propia zona padre", () => {
    expect(() => createZone({ ...valid, parentId: valid.id })).toThrow(ZoneSelfParentError);
  });

  it("rechaza una fecha de creación ilegible", () => {
    expect(() => createZone({ ...valid, createdAt: "ayer" })).toThrow(InvalidZoneError);
  });
});
