import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "./date";

describe("formatDate", () => {
  it("muestra solo la fecha, en la hora de Colombia", () => {
    expect(formatDate("2026-12-02T02:30:00.000Z")).toBe("1 de diciembre de 2026");
    expect(formatDate(new Date("2026-12-02T15:00:00.000Z"))).toBe("2 de diciembre de 2026");
  });
});

describe("formatDateTime", () => {
  it("muestra la fecha en la hora de Colombia, aunque cambie de día", () => {
    const formatted = formatDateTime("2026-12-02T02:30:00.000Z");

    expect(formatted).toContain("1 de diciembre de 2026");
    expect(formatted).toMatch(/9:30/);
  });
});
