import { describe, expect, it } from "vitest";
import { InvalidVenueError } from "../errors/venue-errors";
import { createVenue, hasLocation, type Venue } from "./venue";

const valid: Venue = {
  id: 7,
  name: "Teatro Jorge Isaacs",
  description: null,
  address: "Cra 3 # 12-28",
  latitude: null,
  longitude: null,
  isVerified: true,
  zone: { id: 2, name: "Centro" },
  owner: { id: 5, username: "owner", fullName: "Dueño Uno" },
  createdAt: "2026-10-01T12:00:00.000Z",
};

describe("createVenue", () => {
  it("construye un lugar válido y lo congela por completo", () => {
    const venue = createVenue(valid);
    expect(venue).toEqual(valid);
    expect(Object.isFrozen(venue)).toBe(true);
    expect(Object.isFrozen(venue.zone)).toBe(true);
  });

  it("rechaza un nombre vacío", () => {
    expect(() => createVenue({ ...valid, name: "" })).toThrow(InvalidVenueError);
  });

  it("exige una zona válida", () => {
    expect(() => createVenue({ ...valid, zone: { id: -1, name: "Centro" } })).toThrow(InvalidVenueError);
  });

  it("exige un dueño válido", () => {
    expect(() => createVenue({ ...valid, owner: { ...valid.owner, id: 0 } })).toThrow(InvalidVenueError);
  });
});

describe("ubicación", () => {
  it("acepta las dos coordenadas o ninguna", () => {
    expect(hasLocation(createVenue({ ...valid, latitude: 3.4497, longitude: -76.5339 }))).toBe(true);
    expect(hasLocation(createVenue(valid))).toBe(false);
  });

  it("rechaza una coordenada sola o fuera de rango", () => {
    expect(() => createVenue({ ...valid, latitude: 3.4497 })).toThrow(InvalidVenueError);
    expect(() => createVenue({ ...valid, latitude: 3.4, longitude: 200 })).toThrow(InvalidVenueError);
  });
});
