import { describe, expect, it } from "vitest";
import { isDateString, isNonBlank, isOneOf, isPositiveInt } from "./invariants";

describe("invariantes compartidas", () => {
  it("isPositiveInt acepta solo enteros mayores que cero", () => {
    expect(isPositiveInt(1)).toBe(true);
    expect(isPositiveInt(0)).toBe(false);
    expect(isPositiveInt(-3)).toBe(false);
    expect(isPositiveInt(1.5)).toBe(false);
    expect(isPositiveInt(Number.NaN)).toBe(false);
    expect(isPositiveInt("1")).toBe(false);
  });

  it("isNonBlank rechaza textos vacíos o solo con espacios", () => {
    expect(isNonBlank("Cali")).toBe(true);
    expect(isNonBlank("   ")).toBe(false);
    expect(isNonBlank("")).toBe(false);
    expect(isNonBlank(null)).toBe(false);
  });

  it("isDateString acepta fechas ISO y rechaza texto suelto", () => {
    expect(isDateString("2026-11-18T14:00:00.000Z")).toBe(true);
    expect(isDateString("mañana")).toBe(false);
    expect(isDateString(undefined)).toBe(false);
  });

  it("isOneOf comprueba que el valor esté en la lista", () => {
    expect(isOneOf(["A", "B"], "A")).toBe(true);
    expect(isOneOf(["A", "B"], "C")).toBe(false);
  });
});
