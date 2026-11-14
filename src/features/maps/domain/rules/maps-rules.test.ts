import { describe, expect, it } from "vitest";
import { PlaceQueryTooShortError } from "../errors/maps-errors";
import { googleMapsSearchUrl } from "./maps-links";
import { normalizePlaceQuery } from "./place-query";

describe("normalizePlaceQuery", () => {
  it("quita los espacios alrededor", () => {
    expect(normalizePlaceQuery("  Teatro Municipal ")).toBe("Teatro Municipal");
  });

  // Google cobra cada búsqueda: no se gasta una en un texto que no sirve
  it("exige al menos 3 letras", () => {
    expect(() => normalizePlaceQuery(" te ")).toThrow(PlaceQueryTooShortError);
  });
});

describe("googleMapsSearchUrl", () => {
  // Enlace público de Google Maps: no necesita API key
  it("busca el lugar por nombre, dirección y ciudad", () => {
    expect(googleMapsSearchUrl({ name: "Teatro Municipal", address: "Cra 5 # 6-64" })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Teatro+Municipal%2C+Cra+5+%23+6-64%2C+Cali",
    );
  });

  it("sin dirección busca por nombre y ciudad", () => {
    expect(googleMapsSearchUrl({ name: "Museo La Tertulia", address: null })).toBe(
      "https://www.google.com/maps/search/?api=1&query=Museo+La+Tertulia%2C+Cali",
    );
  });
});
