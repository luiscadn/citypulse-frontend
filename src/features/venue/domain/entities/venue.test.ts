import { describe, expect, it } from "vitest";
import { InvalidVenueError } from "../errors/venue-errors";
import { createVenue, type Venue } from "./venue";

const valid: Venue = {
  id: 7,
  name: "Teatro Jorge Isaacs",
  description: null,
  address: "Cra 3 # 12-28",
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
