import { describe, expect, it } from "vitest";
import { formatDateTime } from "./date";

describe("formatDateTime", () => {
  it("muestra la fecha en la hora de Colombia, aunque cambie de día", () => {
    const formatted = formatDateTime("2026-12-02T02:30:00.000Z");

    expect(formatted).toContain("1 de diciembre de 2026");
    expect(formatted).toMatch(/9:30/);
  });
});
